"""
This code defines a script which renews the YouTube playlists associated with
the Reading Room project.

It is adapted from code which can be found at:

    https://developers.google.com/explorer-help/code-samples#python
"""

# Standard imports.
import os
import sqlite3
from pathlib import Path

# Non-standard imports.
import googleapiclient.discovery
import googleapiclient.errors
import oauth2client.client
import oauth2client.file
import oauth2client.tools
from progressbar import progressbar

# Constants.
LINK_COL_KEY = "external_link"
PLAYLIST_KEY_SONGS = "PL983exzTR3Rb6W5rdf3udknRzLzi_tgwJ"
VIDEO_KEY_MOCK = "M7FIvfx5J10"
YOUTUBE_API_URL = "https://www.googleapis.com/auth/youtube.force-ssl"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"
YOUTUBE_PLAYLIST_MAX_MAX_RESULTS = 50
YOUTUBE_URL_PREFIX = "https://www.youtube.com/watch?v="
# Paths.
PATH_OBJ_TO_THIS_DIR = Path(__file__).parent.resolve()
PATH_OBJ_TO_DATABASES_DIR = PATH_OBJ_TO_THIS_DIR.parent/"databases"
PATH_TO_MEDIA_DB = str(PATH_OBJ_TO_DATABASES_DIR/"media.db")
PATH_TO_TEMP_YOUTUBE_API_CREDENTIALS = \
    str(Path.home()/"temp_youtube_api_credentials.json")
PATH_TO_YOUTUBE_API_SECRETS = str(Path.home()/"youtube_api_secrets.json")

#########################
# FUNCTIONS AND CLASSES #
#########################

def get_local_songs_key_set():
    """ Select all songs from the database, and return a list of YouTube keys
    for each, where possible. """
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Song ORDER BY title DESC;")
    raw = cursor.fetchall()
    connection.close()
    result = set()
    for item in raw:
        key = get_youtube_key_from_url(item[LINK_COL_KEY])
        if key:
            result.add(key)
    return result

def get_db_connection():
    """ Return a connection object to the media database. """
    result = sqlite3.connect(PATH_TO_MEDIA_DB)
    result.row_factory = dict_factory
    return result

def dict_factory(cursor, row):
    """ Ensures a list of dictionaries is returned. """
    item = {}
    for idx, col in enumerate(cursor.description):
        item[col[0]] = row[idx]
    return item

def get_youtube_key_from_url(url):
    """ Extract the key for a YouTube video from its URL. """
    if (not url) or (not url.startswith(YOUTUBE_URL_PREFIX)):
        return None
    result = url[len(YOUTUBE_URL_PREFIX):]
    return result

def disable_oauthlib_https_verification():
    """ Disable OAuthlib's HTTPS verification when running locally. DO NOT leave
    this option enabled in production. """
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

def get_video_keys_in_youtube_playlist(playlist_key):
    """ Get a list of the keys within a given YouTube playlist. """
    youtube = get_authenticated_service_youtube()
    response = \
        youtube.playlistItems().list(
            part="snippet",
            playlistId=playlist_key,
            maxResults=str(YOUTUBE_PLAYLIST_MAX_MAX_RESULTS)
        )
    result = set()
    while response:
        executed = response.execute()
        for item in executed["items"]:
            result.add(item["snippet"]["resourceId"]["videoId"])
        response = youtube.playlistItems().list_next(response, executed)
    return result

def get_authenticated_service_youtube():
    """ Return an authenticated connection to the YouTube API. """
    scopes = [YOUTUBE_API_URL]
    store = oauth2client.file.Storage(PATH_TO_TEMP_YOUTUBE_API_CREDENTIALS)
    credentials = store.get()
    if not credentials or credentials.invalid:
        flow = \
            oauth2client.client.flow_from_clientsecrets(
                PATH_TO_YOUTUBE_API_SECRETS, scopes
            )
        credentials = oauth2client.tools.run_flow(flow, store)
    result = \
        googleapiclient.discovery.build(
            YOUTUBE_API_SERVICE_NAME,
            YOUTUBE_API_VERSION,
            credentials=credentials
        )
    return result

def append_to_youtube_playlist(playlist_key, video_key):
    """ Add a given YouTube video to a given YouTube playlist. """
    body = {
        "snippet": {
            "playlistId": playlist_key,
            "position": 0,
            "resourceId": {
                "kind": "youtube#video",
                "videoId": video_key
            }
        }
    }
    youtube = get_authenticated_service_youtube()
    request = youtube.playlistItems().insert(part="snippet", body=body)
    response = request.execute()
    return response

def renew_songs():
    """ Renew the Songs playlist. """
    if not Path(PATH_TO_YOUTUBE_API_SECRETS).exists():
        print("No secrets file at path: "+PATH_TO_YOUTUBE_API_SECRETS)
        return False
    bad_keys = []
    local_songs_key_set = get_local_songs_key_set()
    disable_oauthlib_https_verification()
    youtube_songs_key_set = \
        get_video_keys_in_youtube_playlist(PLAYLIST_KEY_SONGS)
    missing_keys = list(local_songs_key_set-youtube_songs_key_set)
    print("Adding keys to playlist...")
    for video_key in progressbar(missing_keys):
        try:
            append_to_youtube_playlist(PLAYLIST_KEY_SONGS, video_key)
        except googleapiclient.errors.HttpError:
            bad_keys.append(video_key)
    if bad_keys:
        print(
            "There was a problem with the following keys, and therefore they "+
            "were not added to the playlist:"
        )
        print(bad_keys)
        return False
    return True

###################
# RUN AND WRAP UP #
###################

def run():
    """ Run this script. """
    renew_songs()

if __name__ == "__main__":
    run()
