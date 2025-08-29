import mongoose, { Document, Schema } from "mongoose";

export interface CommentDocument extends Document {
  message: string;
  user: Schema.Types.ObjectId; // ID of user who wrote this comment
  likes: Schema.Types.ObjectId[]; //ID of users who liked this comment
  dislikes: Schema.Types.ObjectId[]; //ID of users who disliked this comment
  confession: Schema.Types.ObjectId; // ID of confession this comment was made on
}

const commentSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    confession: {
      type: Schema.Types.ObjectId,
      ref: "Confession",
      required: true,
    },
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
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
