import config from "../../config/app.js";

export class AppServiceProvider {
  /**
   * @param {import("express").Express} app
   */
  constructor(app) {
    this.boot(app);
  }

  boot() {
    process.env.TZ = config.timezone;

    // eslint-disable-next-line no-undef
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
  }
}
