import { AppServiceProvider } from "./AppServiceProvider.js";
import { ViewServiceProvider } from "./ViewServiceProvider.js";

export class ServiceProvider {
  /**
   * @param {import("express").Express} app
   */
  constructor(app) {
    /** @type {import("express").Express} */
    this.app = app;
  }

  boot() {
    new AppServiceProvider(this.app).boot();
    new ViewServiceProvider(this.app).boot();
  }
}
