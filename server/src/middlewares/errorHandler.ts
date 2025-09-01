import { type ErrorRequestHandler, type Response } from "express";

import logger from "../utils/logger";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/status-codes";
import ApiError from "../utils/apiError";

import { z } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

const zodErrorHandler = (res: Response, error: z.ZodError) => {
  // error.issues object has path which is field and message is the reason why parsing failed
  const errors = error.issues.map((err) => ({ path: err.path.join(","), message: err.message }));
  res.status(BAD_REQUEST).json({ message: "Invalid user data", errors, success: false });
};

const apiErrorHandler = (res: Response, error: ApiError) => {
  res.status(error.statusCode).json({ message: error.message, errorCode: error.errorCode, success: false });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error({
    message: err.message || "Unknown Error",
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof z.ZodError) {
    return zodErrorHandler(res, err);
  }

  if (err instanceof ApiError) {
    return apiErrorHandler(res, err);
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(BAD_REQUEST).json({ message: err.message, success: false });
  }

  res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
};
