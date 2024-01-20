import { HomeController } from "../../../app/http/controllers/api/v1/HomeController.js";
import { asyncHandler } from "../../../app/supports/helpers.js";
import { Router } from "express";

const router = Router();

router.get("/", asyncHandler(HomeController.index));
router.get("/app-version", asyncHandler(HomeController.appVersion));

export default router;
