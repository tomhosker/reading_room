#!/bin/sh

### This script installs the Git hooks.

# Crash on the first non-zero exit code.
set -e

# Constants.
PATH_TO_THIS_DIR=$(dirname $(realpath $0))
PATH_TO_SRC="$PATH_TO_THIS_DIR/../git_hooks"
PATH_TO_DST="$PATH_TO_THIS_DIR/../.git/hooks"

# Let's get cracking...
for file_path in $PATH_TO_SRC/*; do
    cp $file_path $PATH_TO_DST
done