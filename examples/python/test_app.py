def test_app_ping(test_client):
    res = test_client.get("/")
    assert res.status_code == 200
    assert res.data.decode("utf-8") == "Success!"


def test_decrypt(test_client, test_data):
    res = test_client.post(f"/decrypt?data={test_data['encrypted']}")
    assert res.status_code == 200
    assert res.data.decode("utf-8") == test_data["decrypted"]


def test_encrypt(test_client, test_data):
    res = test_client.post(f"/encrypt?data={test_data['plaintext']}")
    assert res.status_code == 200
    assert res.data.decode("utf-8") == test_data["encrypted"]
