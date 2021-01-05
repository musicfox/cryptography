from flask import (
    make_response, Flask, request,
)
import logging
import mfcrypt

logging.basicConfig() 
app = Flask(__name__)
passphrase, salt = 'a randomly generated string hash', 'salt'

@app.route('/', methods=['GET'])
def ping():
    app.logger.debug(request.url)
    return make_response('Success!\n', 200)

@app.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.args.get('data')
    app.logger.debug(data)
    bin_key = mfcrypt.create_bytes_key(passphrase, salt)
    decrypted = mfcrypt.decrypt(data, bin_key)
    return make_response(f"Decrypted data:\n{decrypted}\n", 200)

@app.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.args.get('data')
    bin_key = mfcrypt.create_bytes_key(passphrase, salt, iterations=128)
    encrypted = mfcrypt.encrypt(data, bin_key).decode('utf-8')
    return make_response(f"Encrypted data:\n{encrypted}\nDecrypt via a POST request to the following URI:\n{request.base_url.replace('encrypt', 'decrypt')}?data={encrypted}\n", 200)

if __name__ == '__main__':
    app.run("localhost", port=8080, debug=True)
