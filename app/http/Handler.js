import config from "../../config/app.js";
import loggerMiddleware from "./middleware/logger.js";
import responseMacroMiddleware from "./middleware/response-macro.js";
import cookieParser from "cookie-parser";
import express from "express";

export class Handler {
  /**
   * @param {import("express").Express} app
   */
  constructor(app) {
    this.boot(app);
    this.bootMiddlewareHandler(app);
  }

  /**
   * @param {import("express").Express} app
   */
  boot(app) {
    app.use(
      express.urlencoded({
        extended: false,
        limit: config.maximum_request_body_size,
      }),
    );
    app.use(cookieParser());
  }

  /**
   * @param {import("express").Express} app
   */
  bootMiddlewareHandler(app) {
    app.use(loggerMiddleware);
    app.use(responseMacroMiddleware);
  }
}
