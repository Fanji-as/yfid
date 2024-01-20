import { Exception } from "./Exception.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class NotFoundException extends Exception {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message || ReasonPhrases.NOT_FOUND);

    this.setStatusCode(StatusCodes.NOT_FOUND);
  }
}
