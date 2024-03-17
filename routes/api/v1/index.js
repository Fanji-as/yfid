import home from "./home.js";
import express from "express";
import midtrans from "./midtrans.js";
import transaction from "./transaction.js";

const router = express.Router();

router.use(home);
router.use(midtrans);
router.use(transaction);

export default router;
