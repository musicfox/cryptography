import CryptoJS from 'crypto-js';

/**
 * `encrypt(data, passphrase, salt)`
 *
 * Encrypt the given message with the given secret key.
 *
 * This method first encrypts the given message and then computes
 * the HMAC digest via the `addSignature` method. This digest is
 * concatentated to the end of the encrypted message to verify authenticity.
 *
 * @param
 * `data` encrypted string or object to be decrypted
 *
 * @param
 * `passphrase` string password/key
 *
 * @param
 * `salt` string random salt
 *
 * @returns
 * `string` encrypted text
 *
 * @example
 * ```js
 * import { encrypt } from 'mfcrypt'
 * // Developer todo: define passphrase and salt strings*
 * // encrypt a string
 * const encryptedStringData = await encrypt(
 *   "this is your string to encrypt",
 *   "a secret passphrase",
 *   "a random salt",
 * );
 * // encrypt an object -- you'll get a string back
 * const encryptedObjectData = await encrypt(
 *   {objKey: "this is your object toencrypt"},
 *   "a secret passphrase",
 *   "a random salt",
 * );
 * ```
 */
async function encrypt(data, passphrase, salt) {
  const secretKeyBytes = await createBytesKey(passphrase, salt);
  const iv = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(0, 32));
  const key = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(32, 96));
  let encrypted;
  if (isNotString(data)) {
    encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
    }).toString();
  } else encrypted = CryptoJS.AES.encrypt(data, key, {iv: iv}).toString();
  const digest = await addSignature(passphrase, encrypted);
  return `${encrypted}::${digest}`;
}

/**
 * `decrypt(data, secretKey, typeHint = 'string')`
 *
 * This method returns plaintext data, given encrypted data and a key
 * used for the original encryption. It first computes the HMAC digest
 * for authenticity and then decrypts data.
 *
 * If the encrypted message is valid, this method will
 * automatically compute/compare the digest using the known (shared) key.
 * If valid, decryption will ensue and return the encrypted message in
 * plaintext.

 * @param
 * `data` encrypted string or object to be decrypted.
 *
 * @param
 * `passphrase` string password/key
 *
 * @param
 * `salt` string random salt
 *
 * @param
 * `typeHint` string representing a "typeof" type, defaults to 'string'. See
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 * for a list of values.
 *
 * @returns
 * The decrypted string or object, if given `typeHint` is a value other than
 * 'string'.
 *
 * @example
 * ```js
 * // Developer todo: define passphrase and salt strings
 * // plaintext string
 * const decStringData = await decrypt(encryptedStringData, passphrase, salt);
 * // object
 * const decObjectData = await decrypt(encryptedObjectData, passphrase, salt,
 typeHint= 'object');
 * ```
 */
async function decrypt(data, passphrase, salt, typeHint = 'string') {
  const secretKeyBytes = await createBytesKey(passphrase, salt);
  const endEqIdx = data.indexOf('::');
  const digest = data.substring(endEqIdx).replace('::', '');
  const encdata = data.substring(0, endEqIdx);
  const isAuthentic = await checkSignature(digest, passphrase, encdata);
  if (!isAuthentic) {
    throw new Error('HMAC digest did not compute as authentic.');
  }
  const iv = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(0, 32));
  const key = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(32, 96));
  if (typeHint !== 'string') {
    return JSON.parse(
      CryptoJS.AES.decrypt(encdata, key, {iv: iv}).toString(CryptoJS.enc.Utf8),
    );
  } else {
    return CryptoJS.AES.decrypt(encdata, key, {iv: iv}).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
/**
 * `createBytesKey(passphrase, salt, iterations)`
 *
 * @param
 * `passphrase` string secret.
 * @param
 * `salt` string random hash to salt the encrypted data.
 * @param
 * `iterations` integer defaults to 128. You very unlikely need to change this
 * value.
 *
 * @returns
 * bytes representation of the encrypted hash.
 *
 * @example
 * ```js
 * const bytesKey = creatBytesKey('my Secret random passphrase', 'the Salt');
 * encrypt('some super secret plaintext or bytes to encrypt', bytesKey);
 */
async function createBytesKey(passphrase, salt, iterations = 128) {
  return CryptoJS.PBKDF2(passphrase, salt, {
    keySize: 48,
    iterations: iterations,
  });
}
/**
 * `isNotString(data)`
 *
 * Return true if the given `data` are/is not of the String type.
 *
 * @param
 * `data` any type object
 *
 * @returns
 * boolean True if `data` ARE NOT of String type.
 */
function isNotString(data) {
  return typeof data !== 'string';
}

/**
 * `addSignature`
 *
 * Signs the given data with the given key using
 * the HMAC SHA1 digest, returning a Hexadecimal encoded string.
 *
 * @param
 * `key` string key or passphrase
 *
 * @param
 * `data` string encrypted (or unencrypted!) data to sign
 *
 * @returns signed string with Hexadecimal encoding
 */
async function addSignature(key, data) {
  return CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Hex);
}

/**
 * `checkSignature`
 *
 * Given a key passphrase and data combination in addition to the supposed
 * signed string digest return whether the digests are equal when recreated
 * using `addSignature`.
 *
 * @param
 * `signedString` string digest to comapre with that created by
 * `addSignature(key, data)`
 *
 * @param
 * `key` string key or passphrase
 *
 * @param
 * `data` string data to sign
 *
 * @returns
 * boolean True if the digest match otherwise False
 */
async function checkSignature(signedString, key, data) {
  const digestToCompare = await addSignature(key, data);
  return digestToCompare === signedString;
}
export {createBytesKey, encrypt, decrypt, addSignature, checkSignature};
