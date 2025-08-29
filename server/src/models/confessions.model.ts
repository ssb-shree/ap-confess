import mongoose, { Document, Schema } from "mongoose";

export interface ConfessionDocument extends Document {
  writerID: Schema.Types.ObjectId;
  title: string;
  body: string;
  views: Schema.Types.ObjectId[]; // userID of people who get this specific confession
  likes: Schema.Types.ObjectId[]; // userID of people who liked this confession
  dislikes: Schema.Types.ObjectId[]; // userID of people who disliked this confession
  comments: Schema.Types.ObjectId[]; // ID of comments on this confession
  categories: string[];
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
