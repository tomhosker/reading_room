### This code BUILDS the Python Virtual Environment (VEnv) within which this
### project's code is intended to run.

# Crash on the first non-zero exit code.
set -e

# Local constants.
PATH_TO_THIS_DIR=$(dirname $(realpath $0))
PATH_TO_VENV="$PATH_TO_THIS_DIR/venv"
PATH_TO_PIP_REQUIREMENTS="$PATH_TO_THIS_DIR/pip_requirements.txt"

# Let's get cracking...
python3 -m venv $PATH_TO_VENV
. "$PATH_TO_VENV/bin/activate"
pip install -r $PATH_TO_PIP_REQUIREMENTS --no-cache-dir