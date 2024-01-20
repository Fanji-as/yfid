import expressJoi from "express-joi-validation";
import Joi from "joi";
import _ from "lodash";

/**
 * @typedef {expressJoi.ExpressJoiConfig & {
 *   isAsync?: boolean;
 * }} Config
 */
export class Validator {
  /** @type {Joi} */
  joi;

  /** @type {expressJoi.ExpressJoiInstance} */
  validator;

  /**
   * @param {Config} config
   */
  constructor(config) {
    const cfg = _.omit(_.merge({ passError: true }, _.clone(config)), [
      "isAsync",
    ]);

    this.joi = Joi;

    if (config?.isAsync || false) {
      this.validator = expressJoi.createValidatorAsync(cfg);
    } else {
      this.validator = expressJoi.createValidator(cfg);
    }
  }

  /**
   * @param {object} additional
   */
  generatePaginationValidator(additional = {}) {
    const base = {
      page: this.joi.number().min(1),
      limit: this.joi.number().min(1),
    };

    const schema = this.joi.object(_.merge(_.clone(base), additional));

    return this.validator.query(schema);
  }
}
