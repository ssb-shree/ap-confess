import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/status-codes";
import { writeSchema } from "./confessions.schema";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import ApiError from "../utils/apiError";
import { Confession, type ConfessionDocument } from "../models/confessions.model";
import { User } from "../models/user.model";

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
  const confession = await Confession.create({
    title,
    body,
    categories,
    views: [userID],
    likes: [userID],
    likeCount: 1,
  });

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

  if (confession) {
    confession.likeCount = confession.likes.length;
    confession.dislikeCount = confession.dislikes.length;
    await confession.save();
  }

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

  if (confession) {
    confession.likeCount = confession.likes.length;
    confession.dislikeCount = confession.dislikes.length;
    await confession.save();
  }

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

//get all newest Confessions
const getAllNewConfessionsController = asyncHandler(async (req: Request, res: Response) => {
  const { skip } = req.query;
  const skipNum = Number(skip) || 0;
  const limitNum = 8;

  const confessions = await Confession.aggregate([
    {
      $project: {
        _id: 1,
        createdAt: 1,
        body: 1,
        likeCount: 1,
        dislikeCount: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skipNum },
    { $limit: limitNum },
  ]);

  res.status(OK).json({
    message: "Fetched newest confessions successfully",
    success: true,
    confessions,
  });
});

const getAllBestConfessionsController = asyncHandler(async (req: Request, res: Response) => {
  const { skip } = req.query;
  const skipNum = Number(skip) || 0;
  const limitNum = 8;

  const confessions = await Confession.aggregate([
    {
      $project: {
        _id: 1,
        createdAt: 1,
        body: 1,
        likeCount: 1,
        dislikeCount: 1,
      },
    },
    { $sort: { likeCount: -1 } },
    { $skip: skipNum },
    { $limit: limitNum },
  ]);

  res.status(OK).json({
    message: "Fetched best confessions successfully",
    success: true,
    confessions,
  });
});

const getAllTrendingConfessionsController = asyncHandler(async (req: Request, res: Response) => {
  const { skip } = req.query;
  const skipNum = Number(skip) || 0;
  const limitNum = 8;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const confessions = await Confession.aggregate([
    {
      $match: { createdAt: { $gte: weekAgo } }, // last 7 days
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        body: 1,
        likeCount: 1,
        dislikeCount: 1,
      },
    },
    { $sort: { likeCount: -1, createdAt: -1 } },
    { $skip: skipNum },
    { $limit: limitNum },
  ]);

  res.status(OK).json({
    message: "Fetched trending confessions successfully",
    success: true,
    confessions,
  });
});

// get confession by ID

const getConfessionByIDController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.params) throw new ApiError(BAD_REQUEST, "Invalid Url");

  const confession = await Confession.findById(req.params.confessionID)
    .lean({ virtuals: true })
    .select("writerID title body categories likeCount dislikeCount createdAt")
    .populate([
      {
        path: "comments",
        select: "message userID likeCount dislikeCount createdAt",
        populate: {
          path: "userID",
          select: "username",
        },
      },
    ]);

  if (!confession) throw new ApiError(NOT_FOUND, "Confession Not Found");

  res.status(OK).json({ message: "Confession found successfully", confession, success: true });
});

export {
  writeConfession,
  likeConfessionController,
  dislikeConfessionController,
  getAllNewConfessionsController,
  getAllBestConfessionsController,
  getAllTrendingConfessionsController,
  getConfessionByIDController,
};
