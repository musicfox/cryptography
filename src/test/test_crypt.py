import mfcrypt


def test_create_bytes_key(crypt_data):
    secret_key_bytes = mfcrypt.create_bytes_key(
        crypt_data.passphrase, crypt_data.salt
    )
    assert isinstance(secret_key_bytes, bytes)


def test_encrypt_string(crypt_data):
    encrypted = mfcrypt.encrypt(crypt_data.plaintext, crypt_data.bin_key)
    assert isinstance(encrypted, bytes)
    assert encrypted != crypt_data.plaintext
    assert encrypted == crypt_data.encrypted
    assert len(encrypted)


def test_encrypt_dict(crypt_data):
    encrypted = mfcrypt.encrypt(crypt_data.obj_data, crypt_data.bin_key)
    assert isinstance(encrypted, bytes)
    assert encrypted != crypt_data.obj_data
    assert encrypted == crypt_data.encrypted_object_data
    assert len(encrypted)


def test_decrypt_string(crypt_data):
    decrypted = mfcrypt.decrypt(
        crypt_data.encrypted, crypt_data.bin_key, type_hint="string"
    )
    assert isinstance(decrypted, str)
    assert decrypted == crypt_data.plaintext


def test_decrypt_dict(crypt_data):
    decrypted = mfcrypt.decrypt(
        crypt_data.encrypted_object_data,
        crypt_data.bin_key,
        type_hint="dict",
    )
    assert isinstance(decrypted, dict)
    assert decrypted == crypt_data.obj_data
