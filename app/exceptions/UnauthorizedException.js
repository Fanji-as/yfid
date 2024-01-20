import { Exception } from "./Exception.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class UnauthorizedException extends Exception {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message || ReasonPhrases.UNAUTHORIZED);

    this.setStatusCode(StatusCodes.UNAUTHORIZED);
  }
}
