import CryptoJS from 'crypto-js';

/**
 * `encrypt(message, secretKey)`
 *
 * @param
 * `message` encrypted string or object to be decrypted
 * @param
 * `secretKeyBytes` bytes representation of password/key*
 *
 * @returns
 * `string` encrypted text
 *
 * @example
 * ```js
 * import { encrypt } from 'crypt'
 *
 * // encrypt a string
 * const encryptedStringData = await encrypt(
 *   "this is your string to encrypt",
 *   secretKey
 * );
 * // encrypt an object -- you'll get a string back
 * const encryptedObjectData = await encrypt(
 *   {objKey: "this is your object toencrypt"},
 *   secretKey,
 * );
 * ```
 */
async function encrypt(data, secretKeyBytes) {
  const iv = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(0, 32));
  const key = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(32, 96));
  if (isNotString(data)) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
    }).toString();
  } else return CryptoJS.AES.encrypt(data, key, {iv: iv}).toString();
}

/**
 * `decrypt(data, secretKey, typeHint = 'string')`
 *
 * @param
 * `data` encrypted string or object to be decrypted.
 * @param
 * `secretKey` string password/key.
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
 * // plaintext string
 * const decStringData = await decrypt(encryptedStringData, secretKey);
 * // object
 * const decObjectData = await decrypt(encryptedObjectData, secretKey, typeHint
 * = 'object');
 * ```
 */
async function decrypt(data, secretKeyBytes, typeHint = 'string') {
  const iv = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(0, 32));
  const key = CryptoJS.enc.Hex.parse(secretKeyBytes.toString().slice(32, 96));
  if (typeHint !== 'string') {
    return JSON.parse(
      CryptoJS.AES.decrypt(data, key, {iv: iv}).toString(CryptoJS.enc.Utf8),
    );
  } else {
    return CryptoJS.AES.decrypt(data, key, {iv: iv}).toString(
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

export {createBytesKey, encrypt, decrypt};
