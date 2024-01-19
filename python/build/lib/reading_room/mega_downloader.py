"""
This code defines a class which downloads data from Mega.
"""

# Standard imports.
import sqlite3
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

# Non-standard imports.
from mega_utils import (
    mega_log_in,
    mega_log_out,
    mega_get,
    mega_get_dir
)
from progressbar import progressbar

# Local constants.
DIRECTORIES_TO_SYNC = [
    "limassol",
    "academy/_linked_special",
    "academy/_not_indexed"
]

#########
# ENUMS #
#########

class Prefixes(Enum):
    """ Prefixes to filenames of various kinds of media. """
    ALBUM = "calbum"
    BOOK = "cbook"
    FILM = "cfilm"
    SONG = "csong"

class Dirnames(Enum):
    """ Names of the directories holding various kinds of media. """
    ALBUM = "linked_albums"
    BOOK = "linked_books"
    FILM = "linked_films"
    SONG = "linked_songs"

##############
# MAIN CLASS #
##############

@dataclass
class MegaDownloader:
    """ The class in question. """
    # Input fields.
    username: str
    path_to_downloads_dir: str
    path_to_media_db: str
    quiet: bool = False
    # Constructed fields.
    path_to_academy: str = None
    local_path_to_albums: str = None
    local_path_to_books: str = None
    local_path_to_films: str = None
    local_path_to_songs: str = None
    path_to_limassol = str = None

    def __post_init__(self):
        path_obj_to_academy = Path(self.path_to_downloads_dir)/"academy"
        self.path_to_academy = str(path_obj_to_academy)
        self.local_path_to_albums = \
            str(path_obj_to_academy/Dirnames.ALBUM.value)
        self.local_path_to_books = str(path_obj_to_academy/Dirnames.BOOK.value)
        self.local_path_to_films = str(path_obj_to_academy/Dirnames.FILM.value)
        self.local_path_to_songs = str(path_obj_to_academy/Dirnames.SONG.value)
        self.path_to_limassol = \
            str(Path(self.path_to_downloads_dir)/"limassol")

    def _process_linked_records(self, records, check_download_method):
        """ Check/download the files outlined in a series of records. """
        for index, record in enumerate(records):
            self._alert("("+str(index+1)+" of "+str(len(records))+")")
            if not check_download_method(*record):
                self._alert("Problem actioning record: "+str(record))
                return False
        return True

    def _alert(self, message):
        """ Alert the user of something happening. """
        if not self.quiet:
            print(message)

    def log_in(self) -> bool:
        """ Log into Mega. """
        mega_log_out()
        self._alert("Logging in...")
        return mega_log_in(self.username)

    def log_out(self) -> bool:
        """ Log out of Mega. """
        success = mega_log_out()
        self._alert("Logged out.")
        return success

    def _select(self, query):
        """ Run a given SELECT query against the database. """
        connection = sqlite3.connect(self.path_to_media_db)
        cursor = connection.cursor()
        response = cursor.execute(query)
        result = response.fetchall()
        connection.close()
        return result

    def check_download_linked_album(
            self,
            record_id: int,
            title: str,
            artists: str,
            link: str
        ) -> bool:
        """ Download a given linked album, if necessary. """
        dirname = (
            Prefixes.ALBUM.value+
            "["+
            str(record_id)+
            "]_"+
            title.replace(" ", "_")+
            make_attribution(artists)
        )
        local_path = str(Path(self.local_path_to_albums)/dirname)
        get_code = mega_get_dir(link, local_path, auto_keep=True)
        return interpret_get_code(get_code)

    def check_download_linked_albums(self) -> bool:
        """ Go through the list of linked albums, downloading each one as
        necessary. """
        Path(self.local_path_to_albums).mkdir(parents=True, exist_ok=True)
        query = (
            "SELECT id, title, artists, link "+
            "FROM Album "+
            "WHERE link IS NOT NULL;"
        )
        records = self._select(query)
        self._alert("Downloading linked albums...")
        result = \
            self._process_linked_records(
                records,
                self.check_download_linked_album
            )
        return result

    def check_download_linked_book(
            self,
            record_id: int,
            title: str,
            year_published: int,
            link: str
        ) -> bool:
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
        local_path = str(Path(self.local_path_to_books)/local_filename)
        return interpret_get_code(mega_get(link, local_path))

    def check_download_linked_books(self) -> bool:
        """ Go through the list of linked books, downloading each one as
        necessary. """
        Path(self.local_path_to_books).mkdir(parents=True, exist_ok=True)
        query = "SELECT id, title, year_published, link FROM Book;"
        records = self._select(query)
        self._alert("Downloading linked books...")
        result = \
            self._process_linked_records(
                records,
                self.check_download_linked_book
            )
        return result

    def check_download_linked_film(
            self,
            record_id: int,
            title: str,
            year: int,
            internal_link: str
        ) -> bool:
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
        local_path = str(Path(self.local_path_to_films)/local_filename)
        return interpret_get_code(mega_get(internal_link, local_path))

    def check_download_linked_films(self) -> bool:
        """ Go through the list of linked films, downloading each one as
        necessary. """
        Path(self.local_path_to_films).mkdir(parents=True, exist_ok=True)
        query = (
            "SELECT id, title, year, internal_link "+
            "FROM Film "+
            "WHERE internal_link IS NOT NULL;"
        )
        records = self._select(query)
        self._alert("Downloading linked films...")
        result = \
            self._process_linked_records(
                records,
                self.check_download_linked_film
            )
        return result

    def check_download_linked_song(
            self,
            record_id: int,
            title: str,
            artists: str,
            internal_link: str
        ) -> bool:
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
        return interpret_get_code(mega_get(internal_link, local_path))

    def check_download_linked_songs(self) -> bool:
        """ Go through the list of linked films, downloading each one as
        necessary. """
        Path(self.local_path_to_songs).mkdir(parents=True, exist_ok=True)
        query = (
            "SELECT id, title, artists, internal_link "+
            "FROM Song "+
            "WHERE internal_link IS NOT NULL;"
        )
        records = self._select(query)
        self._alert("Downloading linked songs...")
        result = \
            self._process_linked_records(
                records,
                self.check_download_linked_song
            )
        return result

    def check_download_linked(self) -> bool:
        """ Go throug all the linked files, downloading each one as
        necessary. """
        if (
            self.check_download_linked_albums() and
            self.check_download_linked_books() and
            self.check_download_linked_films() and
            self.check_download_linked_songs()
        ):
            return True
        return False

    def check_directories_to_sync(
            self,
            auto_delete: bool = False,
            auto_keep: bool = False
        ) -> bool:
        """ Synchronise the remote and local versions of folders in the remote
        root directory. """
        for remote_path in DIRECTORIES_TO_SYNC:
            self._alert("Syncing "+remote_path+"...")
            local_path = str(Path(self.path_to_downloads_dir)/remote_path)
            success = \
                mega_get_dir(
                    remote_path,
                    local_path,
                    auto_delete=auto_delete,
                    auto_keep=auto_keep,
                    quiet=self.quiet
                )
            if not success:
                self._alert("There was a problem syncing "+remote_path+".")
                return False
        return True

    def check_download_sync(
            self,
            auto_delete: bool = True,
            auto_keep: bool = False
        ) -> bool:
        """ Do everything. """
        if not self.log_in():
            self._alert("There was a problem logging in.")
            return False
        self._alert("Checking/downloading linked files...")
        if not self.check_download_linked():
            return False
        self._alert("Syncing directories...")
        check_directories = \
            self.check_directories_to_sync(
                auto_delete=auto_delete,
                auto_keep=auto_keep
            )
        if not check_directories:
            return False
        if not self.log_out():
            self._alert("There was a problem logging out.")
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

def interpret_get_code(get_code):
    """ Decide whether a given code represents a success. """
    if get_code.value:
        return True
    return False
