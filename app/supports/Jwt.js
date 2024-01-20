import config_app from "../../config/app.js";
import config from "../../config/jwt.js";
import jsonwebtoken from "jsonwebtoken";

export class Jwt {
  /**
   * @param {string | object | Buffer} payload
   * @param {string | string[]} [audience]
   */
  static create(payload, audience = undefined) {
    return jsonwebtoken.sign(payload, this.config.secret, {
      algorithm: config.algorithm,
      expiresIn: config.expiresIn,
      issuer: config_app.url,
      audience,
    });
  }

  /**
   * @param {string} token
   * @param {string | RegExp | Array<string | RegExp>} [audience]
   */
  static parse(token, audience = undefined) {
    return jsonwebtoken.verify(token, this.config.secret, {
      algorithms: [config.algorithm],
      issuer: config_app.url,
      audience,
      complete: true,
    });
  }
}
