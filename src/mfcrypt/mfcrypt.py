"""
`mfcrypt.py`

Python cryptographic utilities for Musicfox applications.

"""
from Cryptodome.Protocol import KDF
from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad, unpad
from base64 import b64decode, b64encode
import json
import hmac
from hashlib import sha256
import codecs


class Tuple(tuple):
    pass


def _convert_to_bytes(*args):
    """Attempt to convert the given arguments to bytes. Though tested with
    strings, an individual arguments of *args, serializable to JSON, should
    work.
    """
    results = []
    for arg in args:
        if isinstance(arg, str):  # skip
            results.append(codecs.encode(arg))
        elif isinstance(arg, bytes):
            results.append(arg)
        elif isinstance(arg, dict):
            results.append(json.dumps(arg).encode("utf-8"))
        elif isinstance(arg, list):
            results.append(json.dumps(arg).encode("utf-8"))
        else:
            print(f"{arg} is {type(arg)} and will not be in the results array")
    return results


def check_signature(
    hmac_digest: str, secret_key_bytes: bytes, data: str
) -> bool:
    """
    Check that the given hmac_digest computes to that of the one
    generated from the secret_key and data combination.

    Specifically, use the `compare_digest` method from the [`hmac`](https://docs.python.org/3/library/hmac.html) standard library module.
    """
    computed = add_signature(secret_key_bytes=secret_key_bytes, data=data)
    digests = _convert_to_bytes(hmac_digest, computed)
    a, b = digests
    return hmac.compare_digest(a, b)


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
    encdata, digest = data.split(b"::")
    if not check_signature(
        digest, secret_key_bytes=secret_key_bytes, data=encdata.decode("utf-8")
    ):
        raise ValueError(
            f"Hash comparison failed. This has automatically been reported to the United States Federal Bureau of Investigation as a potential cyber crime."
        )
    data = b64decode(encdata)
    iv, key = _extract_iv_and_key(secret_key_bytes)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    text = unpad(cipher.decrypt(data), 16)
    if type_hint != "string":
        return json.loads(text.decode("utf-8"))
    return text.decode("utf-8")


def encrypt(data, secret_key_bytes: bytes, type_hint: str = "string") -> bytes:
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
        raise TypeError("Data must be a string, bytes, bytearray, or a dict.")
    iv, key = _extract_iv_and_key(secret_key_bytes)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    enctext = cipher.encrypt(pad(data, 16))
    b64enctext = b64encode(enctext)
    computed_hash = add_signature(
        secret_key_bytes=secret_key_bytes, data=b64enctext.decode("utf-8")
    ).encode("utf-8")
    return b64enctext + b"::" + computed_hash


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


def add_signature(secret_key_bytes: bytes, data: str) -> str:
    """
    Generate an HMAC digest using the given secret key and data string.

    >_Note: This produces a hex digest string for use in message authentication._
    """
    digest = hmac.new(
        secret_key_bytes, data.encode("utf-8"), sha256
    ).hexdigest()
    return digest
