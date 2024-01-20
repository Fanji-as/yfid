import config from "../../config/app.js";
import nunjucks from "nunjucks";

export class ViewServiceProvider {
  /**
   * @param {import("express").Express} app
   */
  constructor(app) {
    /** @type {import("express").Express} */
    this.app = app;
  }

  boot() {
    const view = nunjucks.configure("resources/views", {
      autoescape: true,
      express: this.app,
    });

    view.addFilter(
      "json",
      /**
       * Returns a JSON stringified version of the value, safe for inclusion in an
       * inline ```<script>``` tag. The optional argument 'spaces' can be used for
       * pretty-printing.
       *
       * Output is NOT safe for inclusion in HTML! If that's what you need, use the
       * built-in 'dump' filter instead.
       *
       * @param {string | number} [spaces]
       */
      function (value, spaces) {
        if (value instanceof nunjucks.runtime.SafeString) {
          value = value.toString();
        }

        const jsonString = JSON.stringify(value, null, spaces).replace(
          /</g,
          "\\u003c",
        );

        return nunjucks.runtime.markSafe(jsonString);
      },
    );

    view.addGlobal("url", config.url);

    this.app.set("nunjucks", view);
  }
}
