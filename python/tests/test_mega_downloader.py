"""
This code tests the MegaDownloader class.
"""

# Standard imports.
from enum import Enum
from pathlib import Path
from unittest.mock import Mock, patch

# Source imports.
from source.mega_downloader import MegaDownloader

#############
# TEST ENUM #
#############

class MockReturnCode(Enum):
    """ Something to grease the wheels of the following tests. """
    OK = 1

###########
# TESTING #
###########

@patch("source.mega_downloader.mega_log_in", Mock(return_value=True))
@patch("source.mega_downloader.mega_log_out", Mock(return_value=True))
@patch("source.mega_downloader.mega_get", Mock(return_value=MockReturnCode.OK))
@patch(
    "source.mega_downloader.mega_get_dir",
    Mock(return_value=MockReturnCode.OK)
)
def test_full_run():
    """ Test all the major things that the downloader class is supposed to be
    able to do. """
    downloader = \
        MegaDownloader(
            username="someone@email.com",
            path_to_downloads_dir="here",
            path_to_media_db=str(Path(__file__).parent/"test_data"/"media.db")
        )
    assert downloader.log_in()
    assert downloader.check_download_sync()
    assert downloader.log_out()
