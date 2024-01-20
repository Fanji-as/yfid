import config from "../../config/hashing.js";
import { loadEnv } from "./helpers.js";
import bcrypt from "bcrypt";

loadEnv();

export class Hash {
  /**
   * @param {string | Buffer} value
   * @param {string} hashedValue
   */
  static check(value, hashedValue) {
    return bcrypt.compare(value, hashedValue);
  }

  /**
   * @param {string | Buffer} value
   */
  static make(value) {
    return bcrypt.hash(value, config.bcrypt_rounds);
  }
}
