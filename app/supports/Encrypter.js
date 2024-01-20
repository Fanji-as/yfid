import { DecryptException } from "../exceptions/DecryptException.js";
import { DomainException } from "../exceptions/DomainException.js";
import { LogicException } from "../exceptions/LogicException.js";
import { Serialize } from "./Serialize.js";
import crypto from "crypto";
import hashEquals from "hash-equals";

/**
 * Inspired from Laravel Illuminate\Encryption\Encrypter.
 *
 * @link https://github.com/illuminate/encryption/blob/aca373424b516685f72ff66de6960de5edddc3ab/Encrypter.php
 *
 * @typedef {{
 *   iv: string;
 *   value: string;
 *   mac: string;
 *   tag: string;
 * }} Payload
 * @typedef {"aes-128-cbc" | "aes-256-cbc" | "aes-128-gcm" | "aes-256-gcm"} CipherType
 */
export class Encrypter {
  static get supportedCiphers() {
    return {
      "aes-128-cbc": { size: 16, iv_length: 16, aead: false },
      "aes-256-cbc": { size: 32, iv_length: 16, aead: false },
      "aes-128-gcm": { size: 16, iv_length: 12, aead: true },
      "aes-256-gcm": { size: 32, iv_length: 12, aead: true },
    };
  }

  /**
   * @param {string} key
   * @param {CipherType} cipher
   *
   * @throws {DomainException}
   */
  constructor(key, cipher) {
    this.key = Encrypter.parseKey(key);

    if (!Encrypter.supported(this.key, cipher)) {
      const ciphers = Object.keys(Encrypter.supportedCiphers).join(", ");

      throw new DomainException(
        `Unsupported cipher or incorrect key length. Supported ciphers are: ${ciphers}.`,
      );
    }

    /** @type {CipherType} */
    this.cipher = cipher.toLowerCase();
  }

  /**
   * @param {string} key
   *
   * @throws {LogicException}
   */
  static parseKey(key) {
    if (typeof key !== "string" || key.length < 1) {
      throw new LogicException("Encrypter key must be a string");
    }

    if (key.startsWith("base64:")) {
      key = Buffer.from(key.replace("base64:", ""), "base64");
    }

    return key;
  }

  /**
   * @param {string} key
   * @param {CipherType} cipher
   */
  static supported(key, cipher) {
    if (!this.supportedCipher(cipher)) {
      return false;
    }

    return key.length === this.supportedCiphers[cipher.toLowerCase()].size;
  }

  /**
   * @param {CipherType} cipher
   */
  static supportedCipher(cipher) {
    return typeof this.supportedCiphers[cipher.toLowerCase()] !== "undefined";
  }

  get cipherSize() {
    return Encrypter.supportedCiphers[this.cipher].size ?? 32;
  }

  get cipherIvLength() {
    return Encrypter.supportedCiphers[this.cipher].iv_length ?? 16;
  }

  get cipherAead() {
    return Encrypter.supportedCiphers[this.cipher].aead ?? false;
  }

  encrypt(value, serialize = true) {
    let iv = crypto.randomBytes(this.cipherIvLength);
    const cipher = crypto.createCipheriv(this.cipher, this.key, iv);

    let encrypted = cipher.update(
      serialize ? Serialize.serialize(value) : value,
      "utf8",
      "base64",
    );
    encrypted += cipher.final("base64");

    iv = Buffer.from(iv).toString("base64");

    const mac = this.hash(iv + encrypted);
    const tag = (() => {
      try {
        return Buffer.from(cipher.getAuthTag()).toString("base64");
      } catch (error) {
        return "";
      }
    })();

    return Buffer.from(
      Serialize.serialize({ iv, value: encrypted, mac, tag }),
    ).toString("base64");
  }

  /**
   * @param {string} value
   */
  encryptString(value) {
    return this.encrypt(value, false);
  }

  /**
   * @param {string} encrypted
   */
  decrypt(encrypted, unserialize = true) {
    let { iv, value, tag } = this.getJsonPayload(encrypted);

    tag = tag.length < 1 ? null : Buffer.from(tag, "base64");

    this.ensureTagIsValid(tag);

    const decipher = crypto.createDecipheriv(
      this.cipher,
      this.key,
      Buffer.from(iv, "base64"),
    );

    if (tag) {
      decipher.setAuthTag(tag, "base64");
    }

    let decrypted = decipher.update(value, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return unserialize ? Serialize.deserialize(decrypted) : decrypted;
  }

  /**
   * @param {string} encrypted
   * @returns {string}
   */
  decryptString(encrypted) {
    return this.decrypt(encrypted, false);
  }

  /**
   * @param {CipherType} cipher
   */
  static generateKey(cipher) {
    if (!this.supportedCipher(cipher)) {
      const ciphers = Object.keys(Encrypter.supportedCiphers).join(", ");

      throw new DomainException(
        `Unsupported cipher. Supported ciphers are: ${ciphers}.`,
      );
    }

    return crypto.randomBytes(Encrypter.supportedCiphers[cipher].size ?? 32);
  }

  /**
   * @param {import("crypto").BinaryLike} value
   */
  hash(value) {
    return crypto.createHmac("sha256", this.key).update(value).digest("hex");
  }

  /**
   * @param {string} payload
   * @returns {Payload}
   *
   * @throws {DecryptException}
   */
  getJsonPayload(payload) {
    payload = Serialize.deserialize(Buffer.from(payload, "base64"));

    if (!this.validPayload(payload)) {
      throw new DecryptException("The payload is invalid.");
    }

    if (!this.cipherAead && !this.validMac(payload)) {
      throw new DecryptException("The MAC is invalid.");
    }

    return payload;
  }

  validPayload(payload) {
    return (
      typeof payload === "object" &&
      Object.prototype.hasOwnProperty.call(payload, "iv") &&
      Object.prototype.hasOwnProperty.call(payload, "value") &&
      Object.prototype.hasOwnProperty.call(payload, "mac") &&
      Buffer.from(payload.iv, "base64").length === this.cipherIvLength
    );
  }

  /**
   * @param {Payload} payload
   */
  validMac(payload) {
    return hashEquals(this.hash(payload.iv + payload.value), payload.mac);
  }

  /**
   * @param {string} tag
   */
  ensureTagIsValid(tag) {
    if (this.cipherAead && tag.length !== 16) {
      throw new DecryptException("Could not decrypt the data.");
    }

    if (!this.cipherAead && typeof tag === "string") {
      throw new DecryptException(
        "Unable to use tag because the cipher algorithm does not support AEAD.",
      );
    }
  }
}

export default Encrypter;
