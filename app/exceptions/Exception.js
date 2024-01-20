import escapeHTML from "escape-html";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class Exception extends Error {
  /** @type {StatusCodes} */
  statusCode;

  /**
   * @param {string} message
   */
  constructor(message) {
    super(message || ReasonPhrases.INTERNAL_SERVER_ERROR);

    this.setStatusCode(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  /**
   * @param {StatusCodes} statusCode
   */
  setStatusCode(statusCode) {
    this.statusCode = statusCode;

    return this;
  }

  render() {
    const DOUBLE_SPACE_REGEXP = /\x20{2}/g;
    const NEWLINE_REGEXP = /\n/g;

    const body = escapeHTML(this.message)
      .replace(NEWLINE_REGEXP, "<br>")
      .replace(DOUBLE_SPACE_REGEXP, " &nbsp;");

    return (
      "<!DOCTYPE html>\n" +
      '<html lang="en">\n' +
      "<head>\n" +
      '<meta charset="utf-8">\n' +
      "<title>Error</title>\n" +
      "</head>\n" +
      "<body>\n" +
      "<pre>" +
      body +
      "</pre>\n" +
      "</body>\n" +
      "</html>\n"
    );
  }
}
