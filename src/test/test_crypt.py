import mfcrypt
import codecs


def test_convert_to_bytes():
    _convert_to_bytes = getattr(mfcrypt, "_convert_to_bytes")
    test1, test2 = "testing", b"testingbytes"
    results = _convert_to_bytes(test1, test2)
    assert isinstance(results, list)
    for item in results:
        assert isinstance(item, bytes)

    big_test = ["testing"] * 1000
    big_test[800] = codecs.encode(big_test[800])  # throw in a funky one
    results = _convert_to_bytes(*big_test)
    for item in results:
        assert isinstance(item, bytes)

    # try dict + list
    test1, test2 = ["testing"], dict(testing="testingbytes")
    results = _convert_to_bytes(test1, test2)
    assert isinstance(results, list)
    for item in results:
        assert isinstance(item, bytes)
    # tuple won't/shouldn't work but not throw
    testtup = ("test", "testing", "tested")
    results = _convert_to_bytes(testtup)
    assert isinstance(results, list)
    assert not len(results)


def test_add_signature_hmac_sha256(crypt_data):
    test_hash = mfcrypt.add_signature(
        crypt_data.passphrase, crypt_data.encrypted
    )
    assert isinstance(test_hash, str)
    assert test_hash != mfcrypt.add_signature(
        "not the right key", crypt_data.encrypted
    )


def test_check_signature_hmac_sha256(crypt_data):
    test_hash = mfcrypt.add_signature(
        crypt_data.passphrase, crypt_data.plaintext
    )
    mfcrypt.check_signature(
        test_hash, crypt_data.passphrase, crypt_data.plaintext
    )


def test_create_bytes_key(crypt_data):
    secret_key_bytes = mfcrypt.create_bytes_key(
        crypt_data.passphrase, crypt_data.salt
    )
    assert isinstance(secret_key_bytes, bytes)


def test_encrypt_string(crypt_data):
    encrypted = mfcrypt.encrypt(
        crypt_data.plaintext, crypt_data.passphrase, crypt_data.salt
    )
    assert isinstance(encrypted, str)
    assert encrypted != crypt_data.plaintext
    assert encrypted == crypt_data.encrypted_payload
    assert len(encrypted)


def test_encrypt_dict(crypt_data):
    encrypted = mfcrypt.encrypt(
        crypt_data.obj_data, crypt_data.passphrase, crypt_data.salt
    )
    assert isinstance(encrypted, str)
    assert encrypted != crypt_data.obj_data
    assert encrypted == crypt_data.encrypted_object_data
    assert len(encrypted)


def test_encrypt_bytearray(crypt_data):
    encoded = bytearray(crypt_data.plaintext.encode("utf-8"))
    try:
        encrypted = mfcrypt.encrypt(
            encoded, crypt_data.passphrase, crypt_data.salt
        )
        assert isinstance(encrypted, str)
        assert encrypted != crypt_data.plaintext.encode("utf-8")
        assert encrypted == crypt_data.encrypted
        assert len(encrypted)
    except TypeError as terr:
        assert (
            "Data must be a string, bytes, bytearray, or a dict." in f"{terr}"
        )


def test_encrypt_bytearray(crypt_data):
    class WillNotWork:
        def __init__(self):
            self.try_me = False

        def __repr__(self):
            return f"try_me: {self.try_me}"

    try:
        wnw = WillNotWork()
        encrypted = mfcrypt.encrypt(
            wnw, crypt_data.passphrase, crypt_data.salt
        )
        assert isinstance(encrypted, bytes)
        assert encrypted != crypt_data.plaintext.encode("utf-8")
        assert encrypted == crypt_data.encrypted
        assert len(encrypted)
    except TypeError as terr:
        assert (
            "Data must be a string, bytes, bytearray, or a dict." in f"{terr}"
        )


def test_decrypt_string(crypt_data):
    decrypted = mfcrypt.decrypt(
        crypt_data.encrypted_payload,
        crypt_data.passphrase,
        crypt_data.salt,
        type_hint="string",
    )
    assert isinstance(decrypted, str)
    assert decrypted == crypt_data.plaintext


def test_decrypt_string_bad_hash(crypt_data):
    try:
        decrypted = mfcrypt.decrypt(
            b"random-badness::notahash",
            crypt_data.passphrase,
            crypt_data.salt,
            type_hint="string",
        )
    except ValueError as verr:
        assert "Hash comparison failed" in f"{verr}"


def test_decrypt_dict(crypt_data):
    decrypted = mfcrypt.decrypt(
        crypt_data.encrypted_object_data,
        crypt_data.passphrase,
        crypt_data.salt,
        type_hint="dict",
    )
    assert isinstance(decrypted, dict)
    assert decrypted == crypt_data.obj_data
