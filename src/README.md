# `mfcrypt`

AES encryption and decryption utilities for Musicfox JavaScript + Python applications and services.

## Motivation
The JavaScript and Python `mfcrypt` utilities are particularly simple/straightforward implementations of multi-layerd
encryption within Musicfox software. In particular, it is important to be able to doubly 
encrypt data during application data SSL transport, at-rest under major-3rd party encryption (Google), and to separate concerns/implementations via completely different systems.

Combined with access restrictions underneath fortified enterprise authorization schemes, users'
data are separated, encrypted, and always inaccessible by default. Multiple layers of service
authorization and identification are required prior to any data utilized in plaintext.

See [PR #8](https://github.com/musicfox/b00st/pull/8) for model/architecture details for our 
fan-b00st application usage.

## Installation

Install via `npm` or `yarn`, e.g.

`npm i --save-dev @musicfox/mfcrypt`.

> &#128161 Remove `--save-dev` if this is an upstream dependency of your lib/app, rather thanone compiled.

## Quick start

For detailed usage examine the code in `examples/javascript/` within the repo and the test suitefound in `src/test/`. 

But the gist (we'll generate a simple bytes PDKDF2 key using the library):

```js
// myEncryptionScript.js
import { createBytesKey, encrypt } from '@musicfox/mfcrypt';

const mySecretPassphrase = 'really I should encrypt this too, and generate it randomly. DO NOT use words like this. Tha NSA will break me.';
const salt = 'randomly generated salt';

const secretKeyBytes = await createBytesKey(mySecretPassphrase);
// Now you can use the bytes key to encrypt/decrypt things
const encStringData = await encrypt('TOP SECRET STRING DATA', secretKeyBytes);
const decStringData = await decrypt(encStringData, secretKeyBytes, 'string'); // give it a type hint at the end, you'll be happy you did ;-)
```

### Over-the-wire
This particular implementation is meant to work with Python Flask-based HTTP webservices. As such, you should be able to use your code above to send encrypted data which may be decrypted
via a Python service.

### Support

File an issue or ask a question herein on our [Issues Board](https://github.com/musicfox/cryptography/issues). 

## Development

Coming soon. 

## Reference/Source Materials

As cryptography is a detailed, mission-critical application security subject please review the
below references prior to usage of this library.
