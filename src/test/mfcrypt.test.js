// crypt.test.js
import {
  addSignature,
  checkSignature,
  createBytesKey,
  decrypt,
  encrypt,
} from '../javascript/mfcrypt';

const secretKey = 'this is an amazing test passphrase';
const salt = 'salt';

describe('Test mfcrypt signing and signature verification functionality.', () => {
  let testString = 'abcdefgh';
  let signedString = '';
  test('Generate a signed Hex string', async () => {
    signedString = await addSignature(secretKey, testString);
    expect(typeof signedString === 'string').toBe(true);
  });
  test('Match a signed Hex string', async () => {
    const signedStringComp = await addSignature(secretKey, testString);
    expect(await checkSignature(signedStringComp, secretKey, testString)).toBe(
      true,
    );
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
    try {
      const encBadData = await encrypt({badVal: 1234}, secretKeyBytes);

      const decStringData = await decrypt(encStringData, secretKeyBytes);
      const decObjData = await decrypt(encObjData, secretKeyBytes, 'object');
      try {
        const decBadData1 = await decrypt(encBadData, secretKeyBytes, 'array'); // not an array

        expect(typeof decBadData1 === 'object').toBe(true);
      } catch (error) {
        // console.log(`Expected error: ${error.message} in decrypting bad
        // data`);
      }
      try {
        const decBadData2 = await decrypt(encBadData, secretKeyBytes, 'string'); // not a string
        expect(typeof decBadData2 === 'string').toBe(true);
        await decrypt(
          // this will throw!
          'blah blah break me::notahash',
          secretKeyBytes,
          'string',
        );
      } catch (error) {
        // console.log(`Expected error: ${error.message} in decrypting bad
        // data`);
      } finally {
        expect(typeof decStringData === 'string').toBe(true);
        expect(typeof decObjData === 'object').toBe(true);
      }
    } finally {
    }
  });
});
