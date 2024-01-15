"""
This code defines a script which renews the links for the various linked media.
"""

# Standard imports.
import argparse
import sqlite3
import subprocess
from pathlib import Path

# Non-standard imports.
from progressbar import progressbar

# Local constants.
BOOK_KEY_FIELD = "id"
BOOK_STAMP = "cbook"
DEFAULT_MEGA_EMAIL = "tomdothosker@gmail.com"
ENCODING = "utf-8"
# Paths.
PATH_OBJ_TO_THIS_DIR = Path(__file__).parent.resolve()
PATH_OBJ_TO_DATABASES_DIR = PATH_OBJ_TO_THIS_DIR.parent/"databases"
PATH_TO_MEDIA_DB = str(PATH_OBJ_TO_DATABASES_DIR/"media.db")

#########################
# CLASSES AND FUNCTIONS #
#########################

class MegaMediaDBInterface:
    """ A class to handle interaction between MEGA and the "media" database. """
    def __init__(self, email, password):
        self.subprocess_log = []
        self.connected = self.log_in(email, password)
        self.media_db_connection = self.make_media_db_connection()

    def my_run(self, arguments, capture_output=False, crash_on_error=True):
        try:
            result = \
                subprocess.run(
                    arguments,
                    check=True,
                    capture_output=capture_output
                )
        except subprocess.CalledProcessError:
            print("Subprocess Log:")
            for item in self.subprocess_log:
                print(" ".join(item))
            if crash_on_error:
                raise
            return False
        self.subprocess_log.append(arguments)
        return result

    def log_in(self, email, password):
        self.my_run(["mega-login", email, password], crash_on_error=False)
        return True

    def log_out(self):
        self.my_run(["mega-logout"])
        self.my_run(["mega-quit"])
        self.connected = False

    def make_media_db_connection(self):
        result = sqlite3.connect(PATH_TO_MEDIA_DB)
        result.row_factory = dict_factory
        return result

    def wrap_up(self):
        self.media_db_connection.commit()
        self.media_db_connection.close()
        self.log_out()

    def fetch_book_table(self):
        cursor = self.media_db_connection.cursor()
        cursor.execute("SELECT * FROM Book;")
        result = cursor.fetchall()
        return result

    def get_link_from_pattern(self, pattern):
        find_process = \
            self.my_run(
                ["mega-find", "-l", "--pattern="+pattern],
                capture_output=True
            )
        output = find_process.stdout.decode(ENCODING)
        remote_path = output.split(" ")[0]
        export_process = \
            self.my_run(["mega-export", "-a", remote_path], capture_output=True)
        output = export_process.stdout.decode(ENCODING)
        result = output.split(": ")[1]
        while result.endswith("\n"):
            result = result[:-1]
        return result

    def renew_link_for_book_with_key(self, key):
        pattern = get_pattern_from_key(key, BOOK_STAMP)
        new_link = self.get_link_from_pattern(pattern)
        cursor = self.media_db_connection.cursor()
        cursor.execute(
            "UPDATE Book SET link = ? WHERE id = ?;",
            [new_link, key]
        )

    def renew_links_for_books(self):
        book_table = self.fetch_book_table()
        for record in progressbar(book_table):
            self.renew_link_for_book_with_key(record[BOOK_KEY_FIELD])

def dict_factory(cursor, row):
    """ Ensures a list of dictionaries is returned. """
    item = {}
    for idx, col in enumerate(cursor.description):
        item[col[0]] = row[idx]
    return item

def get_pattern_from_key(key, stamp):
    """ Get the search pattern from the key and the stamp. """
    result = stamp+"["+str(key)+"]_*"
    return result

###################
# RUN AND WRAP UP #
###################

def make_parser():
    """ Make the argparse parser object. """
    result = \
        argparse.ArgumentParser(
            description="Renew the stored links to the linked files"
        )
    result.add_argument("password", type=str, help="Your MEGA password")
    result.add_argument(
        "--email",
        type=str,
        default=DEFAULT_MEGA_EMAIL,
        help="Your MEGA email address"
    )
    return result

def run():
    """ Run this file. """
    parser = make_parser()
    arguments = parser.parse_args()
    interface = MegaMediaDBInterface(arguments.email, arguments.password)
    interface.renew_links_for_books()
    interface.wrap_up()

if __name__ == "__main__":
    run()
