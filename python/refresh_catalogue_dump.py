"""
This script refreshes the data dump for Hosker's Catalogue.
"""

# Local imports.
from source.db_tools import select, export_data

# Local constants.
SELECT_CATALOGUE = (
    "SELECT PaperBook.* "+
    "FROM PaperBook "+
    "LEFT JOIN BookGenre ON BookGenre.code = PaperBook.genre "+
    "ORDER BY BookGenre.seniority ASC, PaperBook.author NULLS LAST;"
)

###################
# RUN AND WRAP UP #
###################

def run():
    """ Run this script. """
    data = select(SELECT_CATALOGUE, db="media")
    export_data(data, "catalogue.json")

if __name__ == "__main__":
    run()