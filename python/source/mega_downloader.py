"""
This code defines a class which downloads data from Mega.
"""

# Standard imports.
import sqlite3
from pathlib import Path

# Non-standard imports.
from mega_utils import mega_login, mega_logout, mega_sync, mega_get

# Local constants.
BOOK_PREFIX = "cbook"
BOOKS_DIRNAME = "linked_books"

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
        self.username = username
        self.path_to_downloads_dir = path_to_downloads_dir
        self.path_to_media_db = path_to_media_db

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

    def check_download_linked_book(
            self,
            record_id,
            title,
            year_published,
            link
        ):
        """ Download a given linked book, if necessary. """
        local_filename = (
            BOOK_PREFIX+
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
            str(Path(self.path_to_downloads_dir)/BOOKS_DIRNAME/local_filename)
        return mega_get(link, local_path)

    def check_download_linked_books(self):
        """ Go through the list of linked books, downloading each one as
        necessary. """
        path_obj_to_books = Path(self.path_to_downloads_dir)/BOOKS_DIRNAME
        path_obj_to_books.mkdir(parents=True, exist_ok=True)
        query = "SELECT id, title, year_published, link FROM Book;"
        records = self.select(query)
        for record in records:
            if not self.check_download_linked_book(*record):
                return False
        return True
