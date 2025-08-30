import { Router } from "express";
import {
  writeConfession,
  likeConfessionController,
  dislikeConfessionController,
} from "../controllers/confessions.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = Router();

// write a confession {PROTECTED}
router.post("/write", checkAuth, writeConfession);

router.post("/like/:confessionID", checkAuth, likeConfessionController);
router.post("/dislike/:confessionID", checkAuth, dislikeConfessionController);

export default router;
