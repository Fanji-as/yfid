import expressjoi from "express-joi-validation";
import Joi from "joi";

export class TransactionValidator {
  static store = expressjoi
    .createValidator({
      passError: true,
    })
    .body(
      Joi.object({
        data: Joi.object({
          name: Joi.string().min(3).max(30).required(),

          description: Joi.string().min(3).max(30),

          price: Joi.number().integer(),

          quantity: Joi.number().integer().min(1),

          total: Joi.number().integer(),

          user: Joi.object({
            parent_name: Joi.string().min(3).max(30).required(),

            name: Joi.string().min(3).max(30).required(),

            date_birth: Joi.string(),

            phone_number: Joi.number(),

            email: Joi.string().email(),

            address: Joi.string(),
          }),

          payment: Joi.object({
            amount: Joi.number().integer(),
            method: Joi.string(),
          }),
        }),
      }),
    );
}
