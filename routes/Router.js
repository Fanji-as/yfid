import { setContentType } from "../app/supports/helpers.js";
import api from "./api/index.js";
import express from "express";

export class Router {
  /**
   * @param {import("express").Express} app
   */
  constructor(app) {
    app.use(this.generateRouter());
  }

  generateRouter() {
    const router = express.Router();

    router.use(express.static("public"));

    router.use(
      setContentType("application/vnd.api+json"),
      express.json({
        type: "application/vnd.api+json",
      }),
      api,
    );

    return router;
  }
}
