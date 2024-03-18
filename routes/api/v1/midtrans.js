import { asyncHandler } from "../../../app/supports/helpers.js";
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
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const token = await snap.createTransaction(req.body);

    return res.json({ data: token });
  }),
);

router.post(
  "/midtrans/notification",
  // eslint-disable-next-line no-unused-vars
  asyncHandler(async (req, res, next) => {
    // validation using signature key
    const hash = crypto.createHash("sha512");
    const data = hash.update(
      req.body.order_id +
        req.body.status_code +
        req.body.gross_amount +
        process.env.MIDTRANS_SERVER_KEY,
      "utf-8",
    );
    const signatureKey = data.digest("hex");

    if (req.body.signature_key !== signatureKey) {
      throw new Error("Signature is not valid.");
    }

    // validation using Midtrans API
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const response = await snap.transaction.notification(req.body);

    return res.json({ response });
  }),
);

export default router;
