import { Exception } from "./Exception.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class JoiValidationException extends Exception {
  /** @type {import("joi").ValidationResult} */
  result;

  /**
   * @param {import("joi").ValidationResult} result
   */
  constructor(result) {
    super(ReasonPhrases.BAD_REQUEST);

    this.setStatusCode(StatusCodes.BAD_REQUEST);

    this.result = result;
    this.stack = result.error.stack;
  }
}
