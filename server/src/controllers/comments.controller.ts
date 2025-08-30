import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import asyncHandler from "../utils/asyncHandler";
import { commentSchema } from "./comment.schema";
import ApiError from "../utils/apiError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../constants/status-codes";

import { isSpam } from "../utils/spam";
import { Comment } from "../models/comments.model";
import { Confession } from "../models/confessions.model";
import { User } from "../models/user.model";
import { mongoID } from "./confessions.schema";
import z from "zod";

const writeCommentController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { message } = commentSchema.parse(req.body);

  if (!req.user) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  const { confessionID } = req.params;

  if (isSpam(message)) {
    throw new ApiError(
      BAD_REQUEST,
      "Your Comment was Flagged as Spam, too many links or repeated words may cause this"
    );
  }

  const comment = await Comment.create({ message, userID, confessionID });

  // update the confession document
  await Confession.findByIdAndUpdate(confessionID, {
    $addToSet: { comments: comment._id },
  });

  // update the user document of the current user
  await Confession.findByIdAndUpdate(confessionID, {
    $addToSet: { comments: comment._id },
  });

  if (!comment) throw new ApiError(INTERNAL_SERVER_ERROR, "Failed to save in DB");

  res.status(OK).json({ message: "added comment successfully", success: true, comment });
});

const likesCommentController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the commentID
  const { commentID } = z.object({ commentID: z.string().min(1).max(25) }).parse(req.params);

  // get the userID
  if (!req.user) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  const comment = await Comment.findByIdAndUpdate(
    commentID,
    {
      $addToSet: { likes: userID }, // Adds userID to Likes Array if not there
      $pull: { dislikes: userID }, // Removes from dislikes if previously disliked
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    userID,
    {
      $addToSet: { likes: commentID }, // Adds commentID to Likes Array if not there
      $pull: { dislikes: commentID }, // Removes from dislikes if previously disliked
    },
    { new: true }
  );
  res.status(OK).json({ message: "Liked the Video", success: true, comment });
});

// dislike confession
const dislikesCommentController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the commentID
  const { commentID } = z.object({ commentID: z.string().min(1).max(25) }).parse(req.params);

  if (!commentID) throw new ApiError(BAD_REQUEST, "ID not provided");

  // get the userID
  if (!req.user) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentID },
    {
      $addToSet: { dislikes: userID }, // Adds userID to disikes Array if not there
      $pull: { likes: userID }, // Removes from likes if previously liked
    },
    { new: true }
  );

  await User.findOneAndUpdate(
    { _id: userID },
    {
      $addToSet: { dislikes: commentID }, // Adds commentID to dislikes Array if not there
      $pull: { likes: commentID }, // Removes from likes if previously liked
    },
    { new: true }
  );
  res.status(OK).json({ message: "Disliked the Video", success: true, comment });
});

export { writeCommentController, likesCommentController, dislikesCommentController };
