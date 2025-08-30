import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../constants/status-codes";
import { mongoID, writeSchema } from "./confessions.schema";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import ApiError from "../utils/apiError";
import { Confession } from "../models/confessions.model";
import { User } from "../models/user.model";
import { BADRESP } from "dns";

import { isSpam } from "../utils/spam";

const writeConfession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the confession data
  const { title, body, categories } = writeSchema.parse(req.body);

  // get the logged in user
  if (!req.user) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  // validate to catch spam
  if (isSpam(title) || isSpam(body)) {
    throw new ApiError(
      BAD_REQUEST,
      "Your Confession was Flagged as Spam, too many links or repeated words may cause this"
    );
  }

  // create the confession in db
  const confession = await Confession.create({ title, body, categories, views: [userID], likes: [userID] });

  if (!confession) throw new ApiError(INTERNAL_SERVER_ERROR, "Failed to save to DB");

  // update users Document with new confession and like
  const updatedUser = await User.findByIdAndUpdate(
    userID,
    {
      $push: { confessions: confession._id },
      $addToSet: { likes: confession._id },
    },
    { new: true }
  );

  res.status(OK).json({ message: "confessed successfully", success: true, confession });
});

//like confession

const likeConfessionController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the confessionID
  const { confessionID } = req.params;

  if (!confessionID) throw new ApiError(BAD_REQUEST, "ID not provided");

  // get the userID
  if (!req.user) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  const confession = await Confession.findByIdAndUpdate(
    confessionID,
    {
      $addToSet: { likes: userID }, // Adds userID to Likes Array if not there
      $pull: { dislikes: userID }, // Removes from dislikes if previously disliked
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    userID,
    {
      $addToSet: { likes: confessionID }, // Adds commentID to Likes Array if not there
      $pull: { dislikes: confessionID }, // Removes from dislikes if previously disliked
    },
    { new: true }
  );
  res.status(OK).json({ message: "Liked the Video", success: true, confession });
});

// dislike confession
const dislikeConfessionController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the confessionID
  const { confessionID } = req.params;

  if (!confessionID) throw new ApiError(BAD_REQUEST, "ID not provided");

  // get the userID
  if (!req.user) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  const confession = await Confession.findOneAndUpdate(
    { _id: confessionID },
    {
      $addToSet: { dislikes: userID }, // Adds userID to disikes Array if not there
      $pull: { likes: userID }, // Removes from likes if previously liked
    },
    { new: true }
  );

  await User.findOneAndUpdate(
    { _id: userID },
    {
      $addToSet: { dislikes: confessionID }, // Adds commentID to dislikes Array if not there
      $pull: { likes: confessionID }, // Removes from likes if previously liked
    },
    { new: true }
  );
  res.status(OK).json({ message: "Disliked the Video", success: true, confession });
});

export { writeConfession, likeConfessionController, dislikeConfessionController };
