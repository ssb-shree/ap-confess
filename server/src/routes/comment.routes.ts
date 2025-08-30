import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import {
  dislikesCommentController,
  likesCommentController,
  writeCommentController,
} from "../controllers/comments.controller";

const router = Router();

router.post("/write/:confessionID", checkAuth, writeCommentController);

router.post("/like/:commentID", checkAuth, likesCommentController);

router.post("/dislike/:commentID", checkAuth, dislikesCommentController);

export default router;
