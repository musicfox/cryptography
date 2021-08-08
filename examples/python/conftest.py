"""conftest.py 
This contains basic test fixtures for the example Flask app 
unit tests.
"""

import pytest
import mfcrypt
from app import app as flaskapp


@pytest.fixture(scope="session")
def app():
    """Return a basic session-scoped application for tests."""
    return flaskapp


@pytest.fixture(scope="session")
def test_client(app):
    """Return a basic session-scoped Flask `test_client` for tests.

    See [Flask's documentation](https://flask.palletsprojects.com/en/2.0.x/testing/#the-testing-skeleton) on the topic, for more."""
    return app.test_client()


@pytest.fixture(scope="session")
def bin_key(test_data_primitives):
    """Return a bytes key from `create_bytes_key` scoped at the session level"""
    return mfcrypt.create_bytes_key(
        test_data_primitives["passphrase"], test_data_primitives["salt"]
    )


@pytest.fixture(scope="session")
def encrypted(test_data_primitives, bin_key):
    """Return a session-scoped encrypted string using test data"""
    return mfcrypt.encrypt(
        test_data_primitives["plaintext"], bin_key, "string"
    ).decode("utf-8")


@pytest.fixture(scope="session")
def decrypted(encrypted, bin_key):
    """Return the encrypted session-scoped string, decrypted"""
    return mfcrypt.decrypt(encrypted, bin_key, "string")


@pytest.fixture(scope="session")
def test_data_primitives():
    """The basic primitives `salt`, `passphrase` and `plaintext` used for
    encryption and decryption testing."""
    return dict(
        salt="salt",
        passphrase="a randomly generated string hash",
        plaintext="Some type of secret. Trump fumbled COVID. Shhh! No one should know this. TOP SECRET!",
    )


@pytest.fixture(scope="session")
def test_data(test_data_primitives, bin_key, encrypted, decrypted):
    """Session-scoped test data for the full suite. This is the one
    you probably want to use to test functionality, as it incorporates
    most of the other fixtures within the `conftest.py` Pytest setup file."""
    return {
        **test_data_primitives,
        **{"bin_key": bin_key, "encrypted": encrypted, "decrypted": decrypted},
    }
