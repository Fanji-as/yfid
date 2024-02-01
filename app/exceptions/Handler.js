import { winstonLogger } from "../http/middleware/logger.js";
import { JoiValidationException } from "./JoiValidationException.js";
import { NotFoundException } from "./NotFoundException.js";
import ErrorStackParser from "error-stack-parser";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Joi from "joi";

export class Handler {
  /**
   * @param {import("express").Express} app
   */
  constructor(app) {
    app.use(this.notFoundErrorHandler);
    app.use(this.errorHandler);
  }

  /**
   * Catch 404 and forward to error handler.
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  notFoundErrorHandler(req, res, next) {
    return next(new NotFoundException());
  }

  /**
   * Error handler.
   *
   * @param {Error} err
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  // eslint-disable-next-line no-unused-vars
  errorHandler(err, req, res, next) {
    const isDevelopment = req.app.get("env") === "development";

    if (Joi.isError(err?.error)) {
      err = new JoiValidationException(err);
    }

    res.locals.message = err.message;
    res.locals.error = isDevelopment ? err : {};

    winstonLogger.error(err.stack);

    /** @type {import("http-status-codes").StatusCodes} */
    const status =
      err?.statusCode || err?.status || StatusCodes.INTERNAL_SERVER_ERROR;

    if (res.headersSent || !["application/json"].includes(req.headers.accept)) {
      const message = err?.render ? err?.render() : err.message;

      return res
        .status(status)
        .header("content-type", "text/html")
        .send(message);
    }

    return res.status(status).formattedJson({
      metadata: {
        errors: [
          {
            status,
            message:
              isDevelopment || status < 500
                ? err.message
                : getReasonPhrase(status),
          },
        ],
        traces: isDevelopment ? ErrorStackParser.parse(err) : undefined,
      },
    });
  }
}
