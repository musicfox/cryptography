# Python `mfcrypt` example

Yay, you've decided to try out `mfcrypt`. The example herein will 
get you going with a Flask webserver including three endpoints: 

- `/encrypt`
- `/decrypt`
- `/` (ping/health check)

## Installation 

```
pipenv install --dev 
```

This will install development packages -- so you can run included tests -- and production packages. In particular, keep in mind this is only what you need for _this example app_. 

## Run the app 

Run the app on port `8080`:

```
pipenv run python app.py
```

> :tada: Whoa, that was easy! :tada: 

## Usage - Example app

Make sure you have the above app running on port 8080. Then fire up a webserver to call your `encrypt` and/or 
`decrypt` endpoints. 

See the [JavaScript example](https://github.com/musicfox/cryptography/blob/master/examples/javascript/pages/index.jsx) via the asynchronous `fetch` call in `getStaticProps`.

> _The below is here for brevity but please read the jsx file to understand usage more thoroughly._

```jsx
import { createBytesKey, encrypt } from '@musicfox/mfcrypt'
async function getServerSideProps() {
  const baseUrl = "http://localhost:8080";
  const passphrase = "a randomly generated string hash";
  const salt = "salt";
  const plaintext =
    "Some type of secret. Trump fumbled COVID. Shhh! No one should know this. TOP SECRET!";
  const binKey = await createBytesKey(passphrase, salt);
  const encrypted = await encrypt(plaintext, binKey);
  const res = await fetch(`${baseUrl}/decrypt?data=${encrypted}`, {
    method: "POST",
  });
  let result;
  if (res.ok) {
    result = await res.text();
  }
  console.log(JSON.stringify(result))
}
```

> :warning: The above is obviously JavaScript, as the point of `mfcrypt` is simplifying cross-platform encryption over the wire between JavaScript and Python. :warning: 

### Routes in `app.py`

- `GET` `/`: Ping/Health check which should return 200 if the correct port and address (http://localhost:8080)  are used.
- `POST`: `/decrypt`: Given an encrypted string from the `encrypt` method via the `data` query param (in JavaScript or Python), return the decrypted results.
- `POST`: `/encrypt`: Given a plaintext query string via the `data` param, encrypt the results. 

#### Note on security 

:warning: Notice you've not provided a `passphrase` or `salt` value explicitly.
**You need to change _both_ of these and access safely at runtime.** :warning: 

The easiest way to do this in our opinions is through an environment variable, however, do be careful that these are not part of layering in a container image build process.

Your random salt may be stored in plaintext (but avoid it being shown), however, do keep your password safe and encrypted at rest! One excellent library to help with this is [Berglas](https://github.com/GoogleCloudPlatform/berglas), the OSS lib underlying the Google Cloud Secrets product.
