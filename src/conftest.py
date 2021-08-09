import pytest
from collections import namedtuple
import mfcrypt


class TestData(
    namedtuple("crypt_data", ["passphrase", "salt", "plaintext", "obj_data"])
):
    __slots__ = ()

    @property
    def bin_key(self):
        return mfcrypt.create_bytes_key(self.passphrase, self.salt)

    @property
    def encrypted_payload(self):
        return mfcrypt.encrypt(self.plaintext, self.passphrase, self.salt)

    @property
    def encrypted(self):
        return self.encrypted_payload.split("::")[0]

    @property
    def digest(self):
        return self.encrypted_payload.split("::")[1]

    @property
    def encrypted_object_data(self):
        return mfcrypt.encrypt(self.obj_data, self.passphrase, self.salt)

    def __str__(self):
        return f"crypt_data: passphrase = {passphrase} salt = {salt}"


@pytest.fixture(scope="module")
def passphrase():
    return "this is an amazing test passphrase"


@pytest.fixture(scope="module")
def salt():
    return "salt"


@pytest.fixture(scope="module")
def plaintext():
    return "string test"


@pytest.fixture(scope="module")
def obj_data():
    return {
        "test_key": "test data",
        "test_key2": "Insanely long text to make sure we're chunking properly here and there. If not, when we compare at the end none of the tail of this particular message will be present and our test will fail. We don't like crap code at Musicfox.",
        "test_key3": {
            "test_key": "second-level test_data",
        },
    }


@pytest.fixture(scope="module")
def crypt_data(
    passphrase,
    salt,
    plaintext,
    obj_data,
):
    return TestData(passphrase, salt, plaintext, obj_data)
