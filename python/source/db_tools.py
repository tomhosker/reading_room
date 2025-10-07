"""
This code provides some utility functions for working with databases.
"""

# Standard imports.
import json
import sqlite3
from pathlib import Path

# Local imports.
from .paths import PATH_TO_CYPRUS_DB, PATH_TO_MEDIA_DB, PATH_TO_EXPORTS

# Local constants.
DB_PATHS = {"cyprus": PATH_TO_CYPRUS_DB, "media": PATH_TO_MEDIA_DB}
JSON_INDENT = 4

#############
# FUNCTIONS #
#############

def select(
    query: str,
    params: list|None = None,
    db: str = "cyprus"
) -> list[dict]:
    """ Ronseal. """
    if not params:
        params = []
    path_to_db = DB_PATHS[db]
    connection = sqlite3.connect(path_to_db)
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute(query, params)
    raw = cursor.fetchall()
    result = [dict(row) for row in raw]
    return result

def export_data(data: dict|list, filename: str):
    """ Export some JSON-like data to a file in the exports directory. """
    path_obj_to_exports = Path(PATH_TO_EXPORTS)
    path_to_file = str(path_obj_to_exports/filename)
    data_string = json.dumps(data, indent=JSON_INDENT)
    path_obj_to_exports.mkdir(exist_ok=True)
    with open(path_to_file, "w") as export_file:
        export_file.write(data_string)