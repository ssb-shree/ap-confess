import { type Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Confession } from "../models/confessions.model";
import { Report } from "../models/report.model";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

// POST /confessions/:id
export const reportConfession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const confessionID = req.params.id;
  const reporterID = req.user?.userID; // assuming you're attaching user to req in auth middleware
  const { reason } = req.body;

  if (!reporterID) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!reason) {
    throw new ApiError(400, "Report reason is required");
  }

  // check if confession exists
  const confession = await Confession.findById(confessionID);
  if (!confession) {
    throw new ApiError(404, "Confession not found");
  }

  // create report (unique index prevents duplicate reports)
  const report = await Report.create({
    confessionID,
    reporterID,
    reason,
  });

  return res.status(201).json({
    success: true,
    message: "Confession reported successfully",
    data: report,
  });
});
