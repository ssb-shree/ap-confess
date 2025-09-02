import mongoose, { Document, Schema } from "mongoose";
import { INTERNAL_SERVER_ERROR } from "../constants/status-codes";
import ApiError from "../utils/apiError";

export interface ConfessionDocument extends Document {
  writerID: Schema.Types.ObjectId;
  title: string;
  body: string;
  views: Schema.Types.ObjectId[]; // userID of people who get this specific confession
  likes: Schema.Types.ObjectId[]; // userID of people who liked this confession
  dislikes: Schema.Types.ObjectId[]; // userID of people who disliked this confession
  comments: Schema.Types.ObjectId[]; // ID of comments on this confession
  categories: string[];
  likeCount: number;
  dislikeCount: number;
}

const confessionSchema = new Schema<ConfessionDocument>(
  {
    writerID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: { type: Number, default: 0, required: true },
    dislikeCount: { type: Number, default: 0, required: true },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
      },
    ],
    categories: [
      {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
      },
    ],
  },
  { timestamps: true }
);

export const Confession = mongoose.model<ConfessionDocument>("Confession", confessionSchema);
