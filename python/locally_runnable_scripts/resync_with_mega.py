"""
This code downloads all those items from our Mega account which are not
currently held locally.
"""

# Standard imports.
import json
from pathlib import Path

# Local imports.
from reading_room import MegaDownloader
from reading_room.paths import PATH_TO_MEDIA_DB, PATH_TO_MEGA_DOWNLOADS

# Local constants.
PATH_TO_MEGA_ID_JSON = str(Path.home()/"mega_id.json")

##############
# RUN SCRIPT #
##############

def get_mega_username():
    """
    Your mega_id.json file should look like this:

    {
        "username": "someone@email.com"
    }
    """
    try:
        with open(PATH_TO_MEGA_ID_JSON, "r") as id_file:
            id_dict = json.loads(id_file.read())
        result = id_dict["username"]
        return result
    except:
        print(
            "Please build ensure that a correct mega_id.json file is in your "+
            "home directory, and try again."
        )
    return None

def run():
    """ Run this file. """
    mega_username = get_mega_username()
    if not mega_username:
        return
    downloader = \
        MegaDownloader(
            username=mega_username,
            path_to_downloads_dir=PATH_TO_MEGA_DOWNLOADS,
            path_to_media_db=PATH_TO_MEDIA_DB
        )
    downloader.check_download_sync()

if __name__ == "__main__":
    run()
