"""app.py

An example application to highlight the usage of `mfcrypt` as a webservice. 

The could be used as a Kubernetes endpoint or serverless function, for example.

:warning: You must implement secure passphrase and salt generation + storage. :warning:
"""
from flask import (
    make_response,
    Flask,
    request,
)
import logging
import mfcrypt

logging.basicConfig()
app = Flask(__name__)

# :warning: You need to change both of these! :warning:
passphrase, salt = "a randomly generated string hash", "salt"


@app.route("/", methods=["GET"])
def ping():
    """Ping the application to ensure it is up."""
    app.logger.debug(request.url)
    return make_response("Success!", 200)


@app.route("/decrypt", methods=["POST"])
def decrypt():
    """A route to accept a query parameter `data` containing encrypted
    data to decrypt.

    Returns the decrypted value of the `data` parameter."""
    data = request.args.get("data")
    app.logger.debug(data)
    decrypted = mfcrypt.decrypt(data, passphrase, salt)
    return make_response(
        decrypted,
        200,
    )


@app.route("/encrypt", methods=["POST"])
def encrypt():
    """A route to accept a query parameter `data` containing plaintext to
    encrypt.

    Returns the encrypted value of the `data` parameter."""
    data = request.args.get("data")
    encrypted = mfcrypt.encrypt(data, passphrase, salt).decode("utf-8")
    app.logger.debug(
        f"Decrypt via a POST request to the following URI:\n{request.base_url.replace('encrypt', 'decrypt')}?data={encrypted}\n"
    )
    return make_response(
        encrypted,
        200,
    )


if __name__ == "__main__":
    app.run("localhost", port=8080, debug=True)
