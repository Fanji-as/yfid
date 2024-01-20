import { Encrypter } from "../../app/supports/Encrypter.js";
import { faker } from "@faker-js/faker";

/**
 * @param {string} key
 * @param {string} cipher
 */
const assertEncrypter = (key, cipher) => {
  const encrypter = new Encrypter(key, cipher);

  const value = faker.string.sample(40);

  const encrypted = encrypter.encrypt({ value });
  const decrypted = encrypter.decrypt(encrypted);

  const encryptedArray = encrypter.encrypt([value]);
  const decryptedArray = encrypter.decrypt(encryptedArray);

  const encryptedString = encrypter.encryptString(value);
  const decryptedString = encrypter.decryptString(encryptedString);

  expect({ value }).toStrictEqual(decrypted);
  expect([value]).toStrictEqual(decryptedArray);
  expect(value).toStrictEqual(decryptedString);
};

describe("when use encrypter", () => {
  /* eslint-disable jest/expect-expect */
  it("can handle aes-128-cbc cipher", () => {
    const cipher = "aes-128-cbc";
    const key = `base64:${Buffer.from(Encrypter.generateKey(cipher)).toString(
      "base64",
    )}`;

    assertEncrypter(key, cipher);
  });

  it("can handle aes-256-cbc cipher", () => {
    const cipher = "aes-256-cbc";
    const key = `base64:${Buffer.from(Encrypter.generateKey(cipher)).toString(
      "base64",
    )}`;

    assertEncrypter(key, cipher);
  });

  test("with aes-128-gcm cipher", () => {
    const cipher = "aes-128-gcm";
    const key = `base64:${Buffer.from(Encrypter.generateKey(cipher)).toString(
      "base64",
    )}`;

    assertEncrypter(key, cipher);
  });

  test("with aes-256-gcm cipher", () => {
    const cipher = "aes-256-gcm";
    const key = `base64:${Buffer.from(Encrypter.generateKey(cipher)).toString(
      "base64",
    )}`;

    assertEncrypter(key, cipher);
  });
  /* eslint-enable */
});
