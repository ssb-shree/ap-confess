import { Router } from "express";
import { reportConfession } from "../controllers/report.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:id", checkAuth, reportConfession);

export default router;
