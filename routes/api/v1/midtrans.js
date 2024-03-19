import { asyncHandler } from "../../../app/supports/helpers.js";
import { Midtrans } from "../../../app/supports/Midtrans.js";
import crypto from "crypto";
import dotenv from "dotenv";
import { Router } from "express";
import midtransClient from "midtrans-client";

dotenv.config();
const router = Router();

router.post(
  "/midtrans/snap-token",
  // eslint-disable-next-line no-unused-vars
  asyncHandler(async (req, res, next) => {
    const token = await new Midtrans().snap().createTransaction(req.body);

    return res.json({ data: token });
  }),
);

router.post(
  "/midtrans/notification",
  // eslint-disable-next-line no-unused-vars
  asyncHandler(async (req, res, next) => {
    if (!new Midtrans().validateSignatureKey(req.body.signature_key)) {
      throw new Error("Signature is not valid.");
    }

    const response = await new Midtrans()
      .snap()
      .transaction.notification(req.body);

    return res.json({ response });
  }),
);

export default router;
