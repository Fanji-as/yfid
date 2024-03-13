import home from "./home.js";
import express from "express";
import midtrans from "./midtrans.js";

const router = express.Router();

router.use(home);
router.use(midtrans);

export default router;
