import { TransactionController } from "../../../app/http/controllers/api/v1/TransactionController.js";
import { TransactionValidator } from "../../../app/http/validators/api/v1/TransactionValidator.js";
import { asyncHandler } from "../../../app/supports/helpers.js";
import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

router.post(
  "/transactions",
  TransactionValidator.store,
  asyncHandler(TransactionController.store),
);

export default router;
