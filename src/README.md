# `mfcrypt`

AES encryption and decryption utilities for Musicfox JavaScript + Python applications and services. Plain Jane CBC encryption with HMAC (using sha256) payload authentication for both languages.

`mfcrypt` aims to offer the same API regardless of using JavaScript or Python. Save your data at
rest in a database and access it from either language, as long as you know the key.

## Motivation
The JavaScript and Python `mfcrypt` utilities are particularly simple/straightforward implementations of multi-layerd
encryption within Musicfox software. In particular, it is important to be able to doubly 
encrypt data during application data SSL transport, at-rest under major-3rd party encryption (Google), and to separate concerns/implementations via completely different systems.

Combined with access restrictions underneath fortified enterprise authorization schemes, users'
data are separated, encrypted, and always inaccessible by default. Multiple layers of service
authorization and identification are required prior to any data utilized in plaintext.

## Installation

It's easy to install the JavaScript and Python libraries. They're small and offered on [`npm`](https://npmjs.com) and [`pypi`](https://pypi.org). 

### JavaScript
Install via `npm` or `yarn`, e.g.

`npm i --save-dev @musicfox/mfcrypt`.

> ⚠️  Remove `--save-dev` if you're unsure!

### Python
Install via [pypi](https://pypi.org/project/mfcrypt/). 

- with Pip: `pip install --upgrade mfcrypt` 
- with Pipenv: `pipenv install mfcrypt`
- with Poetry: `poetry install mfcrypt`

> ⚠️  Use `--dev` if this is an upstream dependency of your lib/app, rather than your dev environment. 

## Quick start JavaScript

For detailed usage examine the code in `examples/javascript/` within the repo and the test suitefound in `src/test/`. 

But the gist (we'll generate a simple bytes PDKDF2 key using the library):

```js
// myEncryptionScript.js
import { createBytesKey, encrypt } from '@musicfox/mfcrypt';

const mySecretPassphrase = 'really I should encrypt this too, and generate it randomly. DO NOT use words like this. Tha NSA will break me.';
const salt = 'randomly generated salt';

const encStringData = await encrypt('TOP SECRET STRING DATA', mySecretPassphrase, salt);
const decStringData = await decrypt(encStringData, mySecretPassphrase, salt, 'string'); // give it a type hint at the end, you'll be happy you did ;-)
```

## Quick start Python

For detailed usage examine the code in `examples/python`, which contains a Python Flask application you can test out. In addition, you can always examine usage via
the test suite found in the `test` directory.

```python
import mfcrypt

my_secret_passphrase = 'really I should encrypt this too, and generate it randomly. DO NOT use words like this. Tha NSA will break me.'
salt = 'randomly generated salt' 
enc_string_data = encrypt('TOP SECRET STRING DATA', my_secret_passphrase, salt)
dec_string_data = decrypt(enc_string_data, my_secret_passphrase, salt, type_hint='string')
```
#### Over-the-wire
This particular implementation is meant to work with Python HTTP webservices. As such, you should be able to use your code above to send encrypted data which may be decrypted
via a Python service.

### Support

File an issue or ask a question via [Github](https://github.com/musicfox/cryptography/issues). 
