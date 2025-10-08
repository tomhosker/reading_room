#!/bin/sh

### This script runs before `npm install` executes.

# Crash on the first non-zero exit code.
set -e

# Constants.
PATH_TO_THIS_DIR=$(dirname $(realpath $0))

# Let's get cracking...
sh "$PATH_TO_THIS_DIR/install_3rd_party.sh"
sh "$PATH_TO_THIS_DIR/install_git_hooks.sh"