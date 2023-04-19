#!/bin/sh

# Local constants.
APT_PACKAGES="sqlite3"

# Crash on the first error.
set -e

echo "I'm going to install some APT packages system-wide."
echo "To do so, I'm going to need superuser privileges."
sudo echo "Superuser privileges: activate!"

# Install Heroku Command Line Interface.
sudo apt install update --yes
sudo apt install $APT_PACKAGES --yes
