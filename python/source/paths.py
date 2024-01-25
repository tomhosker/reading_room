"""
Ronseal.
"""

# Standard imports.
from pathlib import Path

# Path objects.
PATH_OBJ_TO_READING_ROOM = Path.home()/"reading_room"
PATH_OBJ_TO_DB_DIR = PATH_OBJ_TO_READING_ROOM/"databases"
PATH_OBJ_TO_MEGA_DOWNLOADS = Path.home()/"Downloads"/"mega_downloads"

# Paths.
PATH_TO_READING_ROOM = str(PATH_OBJ_TO_READING_ROOM)
PATH_TO_MEDIA_DB = str(PATH_OBJ_TO_DB_DIR/"media.db")
PATH_TO_MEGA_DOWNLOADS = str(PATH_OBJ_TO_MEGA_DOWNLOADS)
