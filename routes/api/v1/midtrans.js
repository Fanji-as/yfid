import { asyncHandler } from "../../../app/supports/helpers.js";
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

export default router;
