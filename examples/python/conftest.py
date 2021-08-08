import pytest
import mfcrypt


@pytest.fixture(scope="session")
def app():
    from app import app as flaskapp

    return flaskapp


@pytest.fixture(scope="session")
def test_client(app):
    return app.test_client()


@pytest.fixture(scope="session")
def bin_key(test_data_primitives):
    return mfcrypt.create_bytes_key(
        test_data_primitives["passphrase"], test_data_primitives["salt"]
    )


@pytest.fixture(scope="session")
def encrypted(test_data_primitives, bin_key):
    return mfcrypt.encrypt(
        test_data_primitives["plaintext"], bin_key, "string"
    ).decode("utf-8")


@pytest.fixture(scope="session")
def decrypted(encrypted, bin_key):
    return mfcrypt.decrypt(encrypted, bin_key, "string")


@pytest.fixture(scope="session")
def test_data_primitives():
    return dict(
        salt="salt",
        passphrase="a randomly generated string hash",
        plaintext="Some type of secret. Trump fumbled COVID. Shhh! No one should know this. TOP SECRET!",
    )


@pytest.fixture(scope="session")
def test_data(test_data_primitives, bin_key, encrypted, decrypted):
    return {
        **test_data_primitives,
        **{"bin_key": bin_key, "encrypted": encrypted, "decrypted": decrypted},
    }
