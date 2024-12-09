#!/bin/sh

# Crash on the first non-zero exit code.
set -e

# Install CyprianDateTime package for its CLI.
pip install --break-system-packages cyprian_datetime
