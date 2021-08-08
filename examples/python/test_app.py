"""test_app.py 
Unit tests for the example app. 

Coverage should be ~ 98% give or take a few points, as testing this running via CLI is out of scope for the example.
"""


def test_app_ping(test_client):
    """Test that the app pings 200"""
    res = test_client.get("/")
    assert res.status_code == 200
    assert res.data.decode("utf-8") == "Success!"


def test_decrypt(test_client, test_data):
    """Test that sending encrypted plaintext decrypts properly."""
    res = test_client.post(f"/decrypt?data={test_data['encrypted']}")
    assert res.status_code == 200
    assert res.data.decode("utf-8") == test_data["decrypted"]


def test_encrypt(test_client, test_data):
    """Test that receiving data to encrypt is returned properly encrypted."""
    res = test_client.post(f"/encrypt?data={test_data['plaintext']}")
    assert res.status_code == 200
    assert res.data.decode("utf-8") == test_data["encrypted"]
