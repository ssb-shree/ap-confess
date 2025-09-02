import mongoose, { Document, Schema } from "mongoose";
import { INTERNAL_SERVER_ERROR } from "../constants/status-codes";
import ApiError from "../utils/apiError";

export interface CommentDocument extends Document {
  message: string;
  userID: Schema.Types.ObjectId; // ID of user who wrote this comment
  likes: Schema.Types.ObjectId[]; //ID of users who liked this comment
  dislikes: Schema.Types.ObjectId[]; //ID of users who disliked this comment
  confessionID: Schema.Types.ObjectId; // ID of confession this comment was made on

  likesCount: number;
  dislikesCount: number;
}

const commentSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    confessionID: {
      type: Schema.Types.ObjectId,
      ref: "Confession",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    likeCount: { type: Number, default: 0, required: true },
    dislikeCount: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
