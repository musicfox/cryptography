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
const passphrase = secretKey;
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
    const encStringData = await encrypt('string test', passphrase, salt);
    expect(typeof encStringData === 'string').toBe(true);
  });

  test('Encrypt object data.', async () => {
    const encObjData = await encrypt({id: 'craziest'}, passphrase, salt);
    const encBadData = await encrypt({badVal: 1234}, passphrase, salt);

    expect(typeof encObjData === 'string').toBe(true);
    expect(typeof encBadData === 'string').toBe(true);
  });
  test('Decrypt string, object, and mislabeled data', async () => {
    const encStringData = await encrypt('string test', passphrase, salt);
    const encObjData = await encrypt({id: 'craziest'}, passphrase, salt);
    try {
      const encBadData = await encrypt({badVal: 1234}, passphrase, salt);

      const decStringData = await decrypt(encStringData, passphrase, salt);
      const decObjData = await decrypt(encObjData, passphrase, salt, 'object');
      try {
        const decBadData1 = await decrypt(
          encBadData,
          passphrase,
          salt,
          'array',
        ); // not an array

        expect(typeof decBadData1 === 'object').toBe(true);
      } catch (error) {}
      try {
        const decBadData2 = await decrypt(
          encBadData,
          passphrase,
          salt,
          'string',
        ); // not a string
        expect(typeof decBadData2 === 'string').toBe(true);
        await decrypt(
          // this will throw!
          'blah blah break me::notahash',
          passphrase,
          salt,
          'string',
        );
      } catch (error) {
      } finally {
        expect(typeof decStringData === 'string').toBe(true);
        expect(typeof decObjData === 'object').toBe(true);
      }
    } finally {
    }
  });
});
