"""
`mfcrypt.py`

Python cryptographic utilities for Musicfox applications.

"""
from Cryptodome.Protocol import KDF
from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad, unpad
from base64 import b64decode, b64encode
from typing import Type
import json


class Tuple(tuple):
    pass


def _extract_iv_and_key(secret_key_bytes: bytes, block_size: int = 16):
    """
    INTERNAL

    Extract the initialization vector and the key as represented in bytes.
    """
    iv, key = (
        secret_key_bytes[:block_size],
        secret_key_bytes[block_size : (block_size + 2 * block_size)],
    )
    return iv, key


def decrypt(data, secret_key_bytes, type_hint: str = "string"):
    """
    Decrypt the given `data` (bytes string) via the given `secret_key_bytes` which includes
    the `iv` and `key` values.

    This function unpads the data with a default block size of 16 and returns the decrypted data
    as as Python 3 string (unicode).
    """
    data = b64decode(data)
    iv, key = _extract_iv_and_key(secret_key_bytes)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    text = unpad(cipher.decrypt(data), 16)
    if type_hint != "string":
        return json.loads(text.decode("utf-8"))
    return text.decode("utf-8")


def encrypt(data, secret_key_bytes, type_hint: str = "string"):
    """
    Encrypt the given `data` (bytes string) via the given `secret_key_bytes`, which includes the
    `iv` and `key` values.

    This function pads the data prior to encryption with a default block size of 16 and returns
    the base64-encoded encrypted data as a byte string.
    """
    if isinstance(data, dict):
        data = json.dumps(data)
    if isinstance(data, str):
        data = data.encode("utf-8")
    if not isinstance(data, (bytes, bytearray)):
        raise TypeError("data must be a string, bytes, bytearray, or a dict.")
    iv, key = _extract_iv_and_key(secret_key_bytes)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    text = cipher.encrypt(pad(data, 16))
    return b64encode(text)


def create_bytes_key(
    passphrase: str, salt: str, iterations: int = 128
) -> bytes:
    """
    Create the PBKDF2 key given the `passphrase`, `salt`, and optionally adjustable
    `iterations`.

    > :info: _Note: `iterations` should be set as high as budget and user-experience allow for best security._

    Returns the resulting bytes from the `PBKDF2` hash algorithm.
    """
    return KDF.PBKDF2(passphrase, salt.encode("utf-8"), 48, iterations)
