import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { getUserProfile } from "../controllers/auth.controller";

const router = Router();

router.get("/", checkAuth, getUserProfile);

export default router;
