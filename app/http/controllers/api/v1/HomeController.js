import config from "../../../../../config/app.js";

export class HomeController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  // eslint-disable-next-line no-unused-vars
  static async index(req, res, next) {
    return res.json({ message: "Express" });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  // eslint-disable-next-line no-unused-vars
  static async appVersion(req, res) {
    return res.json({
      ["app-version"]: config.version,
    });
  }
}
