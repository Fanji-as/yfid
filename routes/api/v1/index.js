import home from "./home.js";
import express from "express";

const router = express.Router();

router.use(home);

export default router;
