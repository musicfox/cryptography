// crypt.test.js
import {
  addSignature,
  createBytesKey,
  decrypt,
  encrypt,
} from '../javascript/mfcrypt';

const secretKey = 'this is an amazing test passphrase';
const salt = 'salt';

describe('Test mfcrypt signing and signature verification functionality.', () => {
  let testString = 'abcdefgh';
  let passphrase = 'my passphrase';

  test('Generate a signed base64 string', async () => {
    const signedString = await addSignature(passphrase, testString);
    expect(typeof signedString === 'string').toBe(true);
    expect(signedString.length % 4 == 0).toBe(true);
  });
});
describe('Test node.js cryptography functionality.', () => {
  let secretKeyBytes;
  test('Generate key given passphrase', async () => {
    secretKeyBytes = await createBytesKey(secretKey, salt);
    expect(typeof secretKeyBytes !== 'string').toBe(true);
    expect(typeof secretKeyBytes === 'object').toBe(true);
  });

  test('Encrypt string data.', async () => {
    const encStringData = await encrypt('string test', secretKeyBytes);
    expect(typeof encStringData === 'string').toBe(true);
  });

  test('Encrypt object data.', async () => {
    const encObjData = await encrypt({id: 'craziest'}, secretKeyBytes);
    const encBadData = await encrypt({badVal: 1234}, secretKeyBytes);

    expect(typeof encObjData === 'string').toBe(true);
    expect(typeof encBadData === 'string').toBe(true);
  });
  test('Decrypt string, object, and mislabeled data', async () => {
    const encStringData = await encrypt('string test', secretKeyBytes);
    const encObjData = await encrypt({id: 'craziest'}, secretKeyBytes);
    const encBadData = await encrypt({badVal: 1234}, secretKeyBytes);
    const decStringData = await decrypt(encStringData, secretKeyBytes);
    const decObjData = await decrypt(encObjData, secretKeyBytes, 'object');
    const decBadData1 = await decrypt(encBadData, secretKeyBytes, 'array'); // not an array
    const decBadData2 = await decrypt(encBadData, secretKeyBytes, 'string'); // not a string
    expect(typeof decStringData === 'string').toBe(true);
    expect(typeof decObjData === 'object').toBe(true);
    expect(typeof decBadData1 === 'object').toBe(true);
    expect(typeof decBadData2 === 'string').toBe(true);
  });
});
