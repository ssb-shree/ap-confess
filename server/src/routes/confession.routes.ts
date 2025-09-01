import { Router } from "express";
import {
  writeConfession,
  likeConfessionController,
  dislikeConfessionController,
  getAllNewConfessionsController,
  getAllBestConfessionsController,
  getAllTrendingConfessionsController,
  getConfessionByIDController,
} from "../controllers/confessions.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = Router();

// write a confession {PROTECTED}
router.post("/write", checkAuth, writeConfession);

router.post("/like/:confessionID", checkAuth, likeConfessionController);
router.post("/dislike/:confessionID", checkAuth, dislikeConfessionController);

router.get("/new", getAllNewConfessionsController);
router.get("/best", getAllBestConfessionsController);
router.get("/trending", getAllTrendingConfessionsController);

router.get("/:confessionID", getConfessionByIDController);

export default router;
