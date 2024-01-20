import { Encrypter } from "../../app/supports/Encrypter.js";
import { generateKey } from "../../app/supports/helpers.js";
import { faker } from "@faker-js/faker";

test("generate key", () => {
  const cipher = faker.helpers.arrayElement(
    Object.keys(Encrypter.supportedCiphers),
  );

  const key = generateKey(cipher);

  let keyLength = 44;

  if (["aes-128-cbc", "aes-128-gcm"].includes(cipher)) {
    keyLength = 24;
  }

  expect(typeof key).toBe("string");
  expect(key.length).toBe(keyLength);
});
