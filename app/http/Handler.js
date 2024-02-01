import config from "../../config/app.js";
import loggerMiddleware from "./middleware/logger.js";
import responseMacroMiddleware from "./middleware/response-macro.js";
import cookieParser from "cookie-parser";
import express from "express";
import expressSession from "express-session";

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
    app.use(cookieParser(config.cookie_key));
    app.use(
      expressSession({
        secret: config.session_key,
        cookie: { maxAge: config.cookie_max_age },
        saveUninitialized: true,
        resave: true,
      }),
    );
  }

  /**
   * @param {import("express").Express} app
   */
  bootMiddlewareHandler(app) {
    app.use(loggerMiddleware);
    app.use(responseMacroMiddleware);
  }
}
