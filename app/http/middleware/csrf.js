import csurf from "csurf";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function (req, res, next) {
  if (req?.csrfToken) {
    /** @type {import("nunjucks").Environment} */
    const view = req.app.get("nunjucks");

    view.addGlobal("csrf_token", req.csrfToken());
  }

  return next();
}

export const csrf = csurf({ cookie: true });
