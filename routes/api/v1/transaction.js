import dotenv from "dotenv";
import { Router } from "express";
import midtransClient from "midtrans-client";
import { asyncHandler } from "../../../app/supports/helpers.js";
import { model } from "../../../app/models/index.js";
import Joi from "joi";

dotenv.config();
const router = Router();

router.post(
  "/transactions",
  asyncHandler(
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     */
    async (req, res, next) => {
      const schema = Joi.object({
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
      });

      const result = schema.validate(req.body);

      if (result.error !== undefined) {
        throw {
          statusCode: 400,
          message: result.error,
        };
      }

      return next();
    },
  ),
  // eslint-disable-next-line no-unused-vars
  asyncHandler(async (req, res, next) => {
    const createdTransaction = await model.transaction.create({
      data: {
        name: req.body.data.name,
        description: req.body.data.description,
        price: req.body.data.price,
        quantity: req.body.data.quantity,
        total: req.body.data.total,
        user: {
          create: {
            parent_name: req.body.data.user.parent_name,
            name: req.body.data.user.name,
            date_birth: new Date(req.body.data.user.date_birth),
            phone_number: req.body.data.user.phone_number,
            email: req.body.data.user.email,
            address: req.body.data.user.address,
          },
        },
        payments: {
          create: {
            amount: req.body.data.payment.amount,
            method: req.body.data.payment.method,
          },
        },
      },
      include: {
        payments: true,
        user: true,
      },
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    let parameter = {
      transaction_details: {
        order_id: createdTransaction.payments[0].id,
        gross_amount: createdTransaction.payments[0].amount,
      },
      item_details: [
        {
          id: createdTransaction.id,
          name: createdTransaction.name,
          quantity: createdTransaction.quantity,
          price: createdTransaction.price,
        },
      ],
    };

    const token = await snap.createTransaction(parameter);

    return res.json({ data: token });
  }),
);

export default router;
