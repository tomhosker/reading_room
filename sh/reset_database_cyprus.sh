#!/bin/sh

### This script, for the CYPRUS database:
###     (1) Deletes the current database, if it exists;
###     (2) Creates a new database;
###     (3) Runs the create-drop script;
###     (4) Inserts a basic data set.

# Paths.
PATH_TO_ROOT=$(dirname $(dirname $(realpath "$0")))
PATH_TO_DB="$PATH_TO_ROOT/databases/cyprus.db"
PATH_TO_SQL_SCRIPTS="$PATH_TO_ROOT/databases/sql/cyprus"
PATH_TO_CREATE_DROP_SCRIPT="$PATH_TO_SQL_SCRIPTS/create_drop.sql"
PATH_TO_INSERT_BASIC_DATA_SCRIPT="$PATH_TO_SQL_SCRIPTS/insert_basic_data.sql"

# Crash on the first error.
set -e

##############
# RUN SCRIPT #
##############

# Check that we really want to go through with this!
echo "Are you sure you want to delete $PATH_TO_DB and start again? (y/n)"
read answer
if [ $answer != "y" ]; then
    echo "Aborted."
    exit 0
fi

# Delete current database.
rm -f $PATH_TO_DB

# Create new database file.
touch $PATH_TO_DB

# Run create-drop script.
sqlite3 $PATH_TO_DB < $PATH_TO_CREATE_DROP_SCRIPT

# Insert basic data set.
sqlite3 $PATH_TO_DB < $PATH_TO_INSERT_BASIC_DATA_SCRIPT
