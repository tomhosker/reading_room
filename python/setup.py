"""
This code defines the script required by setuptools.
"""

# Non-standard imports.
from setuptools import setup

# Local constants.
PACKAGE_NAME = "reading_room"
VERSION = "1.2.0"
DESCRIPTION = "Python scripts for use within the Reading Room project"
GIT_URL_STEM = "https://github.com/tomhosker"
AUTHOR = "Tom Hosker"
AUTHOR_EMAIL = "tomdothosker@gmail.com"
SCRIPT_PATHS = None
INSTALL_REQUIRES = (
    "google-api-python-client==1.7.2",
    "google-auth==1.8.0",
    "google-auth-httplib2==0.0.3",
    "hosker_utils",
    "oauth2client",
    "mega_utils",
    "progressbar2"
)
INCLUDE_PACKAGE_DATA = True

###################################
# THIS IS WHERE THE MAGIC HAPPENS #
###################################

setup(
    name=PACKAGE_NAME,
    version=VERSION,
    description=DESCRIPTION,
    url=GIT_URL_STEM+"/"+PACKAGE_NAME,
    author=AUTHOR,
    author_email=AUTHOR_EMAIL,
    license="MIT",
    package_dir={ PACKAGE_NAME: "source" },
    packages=[PACKAGE_NAME],
    scripts=SCRIPT_PATHS,
    install_requires=INSTALL_REQUIRES,
    include_package_data=INCLUDE_PACKAGE_DATA
)
