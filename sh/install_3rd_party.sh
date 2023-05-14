#!/bin/sh

# Local constants.
APT_PACKAGES="python3 python3-pip sqlite3"
PATH_TO_CURRENT_DIR=$(dirname $(realpath $0))
PATH_TO_PIP_REQUIREMENTS="$PATH_TO_CURRENT_DIR/../python/requirements.txt"

# Crash on the first error.
set -e

echo "I'm going to install some APT packages system-wide."
echo "To do so, I'm going to need superuser privileges."
sudo echo "Superuser privileges: activate!"

# Install APT packages.
sudo apt update --yes
sudo apt install $APT_PACKAGES --yes

# Install PIP packages.
pip install -r $PATH_TO_PIP_REQUIREMENTS
