"""
This code defines a class which downloads data from Mega.
"""

# Standard imports.
import sqlite3
from enum import Enum
from pathlib import Path

# Non-standard imports.
from mega_utils import (
    mega_login,
    mega_logout,
    mega_sync,
    mega_get,
    mega_get_dir
)

# Local constants.
DIRECTORIES_TO_SYNC = [
#    "limassol",
    "academy/_linked_special",
#    "academy/_not_indexed"
]

#########
# ENUMS #
#########

class Prefixes(Enum):
    ALBUM = "calbum"
    BOOK = "cbook"
    FILM = "cfilm"
    SONG = "csong"

class Dirnames(Enum):
    ALBUM = "linked_albums"
    BOOK = "linked_books"
    FILM = "linked_films"
    SONG = "linked_songs"

##############
# MAIN CLASS #
##############

class MegaDownloader:
    """ The class in question. """
    def __init__(
            self,
            username,
            path_to_downloads_dir="mega_downloads",
            path_to_media_db="media.db"
        ):
        # Input fields.
        self.username = username
        self.path_to_downloads_dir = path_to_downloads_dir
        self.path_to_media_db = path_to_media_db
        # Constructed fields.
        path_obj_to_academy = Path(path_to_downloads_dir)/"academy"
        self.path_to_academy = str(path_obj_to_academy)
        self.local_path_to_albums = \
            str(path_obj_to_academy/Dirnames.ALBUM.value)
        self.local_path_to_books = \
            str(path_obj_to_academy/Dirnames.BOOK.value)
        self.local_path_to_films = \
            str(path_obj_to_academy/Dirnames.FILM.value)
        self.local_path_to_songs = \
            str(path_obj_to_academy/Dirnames.SONG.value)
        self.path_to_limassol = Path(path_to_downloads_dir)/"limassol"

    def login(self):
        """ Log into Mega. """
        return mega_login(self.username)

    def logout(self):
        """ Log out of Mega. """
        mega_logout()

    def select(self, query):
        """ Run a given SELECT query against the database. """
        connection = sqlite3.connect(self.path_to_media_db)
        cursor = connection.cursor()
        response = cursor.execute(query)
        result = response.fetchall()
        connection.close()
        return result

    def check_download_linked_album(
            self,
            record_id,
            title,
            artists,
            link
        ):
        dirname = (
            Prefixes.ALBUM.value+
            "["+
            str(record_id)+
            "]_"+
            title.replace(" ", "_")+
            make_attribution(artists)
        )
        local_path = str(Path(self.local_path_to_albums)/dirname)
        return mega_get_dir(link, local_path, auto_keep=True)

    def check_download_linked_albums(self):
        """ Go through the list of linked albums, downloading each one as
        necessary. """
        Path(self.local_path_to_albums).mkdir(parents=True, exist_ok=True)
        query = (
            "SELECT id, title, artists, link "+
            "FROM Album "+
            "WHERE link IS NOT NULL;"
        )
        records = self.select(query)
        for record in records:
            if not self.check_download_linked_album(*record):
                return False
        return True

    def check_download_linked_book(
            self,
            record_id,
            title,
            year_published,
            link
        ):
        """ Download a given linked book, if necessary. """
        local_filename = (
            Prefixes.BOOK.value+
            "["+
            str(record_id)+
            "]_"+
            title.replace(" ", "_")+
            "_"+
            "("+
            str(year_published)+
            ").pdf"
        )
        local_path = \
            str(Path(self.local_path_to_books)/local_filename)
        return mega_get(link, local_path)

    def check_download_linked_books(self):
        """ Go through the list of linked books, downloading each one as
        necessary. """
        Path(self.local_path_to_books).mkdir(parents=True, exist_ok=True)
        query = "SELECT id, title, year_published, link FROM Book;"
        records = self.select(query)
        for record in records:
            if not self.check_download_linked_book(*record):
                return False
        return True

    def check_download_linked_film(
            self,
            record_id,
            title,
            year,
            internal_link
        ):
        """ Download a given linked film, if necessary. """
        local_filename = (
            Prefixes.FILM.value+
            "["+
            str(record_id)+
            "]_"+
            title.replace(" ", "_")+
            "_("+
            str(year)+
            ").vid"
        )
        local_path = \
            str(Path(self.local_path_to_films)/local_filename)
        return mega_get(internal_link, local_path)

    def check_download_linked_films(self):
        """ Go through the list of linked films, downloading each one as
        necessary. """
        Path(self.local_path_to_films).mkdir(parents=True, exist_ok=True)
        query = (
            "SELECT id, title, year, internal_link "+
            "FROM Film "+
            "WHERE internal_link IS NOT NULL;"
        )
        records = self.select(query)
        for record in records:
            if not self.check_download_linked_film(*record):
                return False
        return True

    def check_download_linked_song(
            self,
            record_id,
            title,
            artists,
            internal_link
        ):
        """ Download a given linked song, if necessary. """
        local_filename = (
            Prefixes.SONG.value+
            "["+
            str(record_id)+
            "]_"+
            title.replace(" ", "_")+
            make_attribution(artists)+
            ".mp3"
        )
        local_path = \
            str(Path(self.local_path_to_songs)/local_filename)
        return mega_get(internal_link, local_path)

    def check_download_linked_songs(self):
        """ Go through the list of linked films, downloading each one as
        necessary. """
        Path(self.local_path_to_songs).mkdir(parents=True, exist_ok=True)
        query = (
            "SELECT id, title, artists, internal_link "+
            "FROM Song "+
            "WHERE internal_link IS NOT NULL;"
        )
        records = self.select(query)
        for record in records:
            if not self.check_download_linked_film(*record):
                return False
        return True

    def check_download_linked(self):
        """ Go throug all the linked files, downloading each one as
        necessary. """
        self.check_download_linked_albums()
        self.check_download_linked_books()
        self.check_download_linked_films()
        self.check_download_linked_songs()

    def check_directories_to_sync(self, auto_delete=False, auto_keep=False):
        """ Synchronise the remote and local versions of folders in the remote
        root directory. """
        for remote_path in DIRECTORIES_TO_SYNC:
            local_path = str(Path(self.path_to_downloads_dir)/remote_path)
            success = \
                mega_get_dir(
                    remote_path,
                    local_path,
                    auto_delete=auto_delete,
                    auto_keep=auto_keep
                )
            if not success:
                return False
        return True

####################
# HELPER FUNCTIONS #
####################

def make_attribution(artists):
    """ Construct a string giving the attribution. """
    if artists:
        result = "_by_"+artists.replace(" ", "_")
        return result
    return ""
