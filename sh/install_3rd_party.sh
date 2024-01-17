#!/bin/sh

# Local constants.
PATH_TO_PYTHON_DIR="./python"

# Crash on the first error.
set -e

# Install PIP packages.
pip install $PATH_TO_PYTHON_DIR
