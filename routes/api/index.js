import v1 from "./v1/index.js";
import express from "express";

const router = express.Router();

router.use("/v1", v1);

export default router;
