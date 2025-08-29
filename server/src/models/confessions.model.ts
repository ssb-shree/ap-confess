import mongoose, { Document, Schema } from "mongoose";

export interface ConfessionDocument extends Document {
  writerID: Schema.Types.ObjectId;
  title: string;
  body: string;
  views: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
  categories: string[];
}

const confessionSchema = new Schema<ConfessionDocument>(
  {
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
    categories: [
      {
        type: String,
        required: true,
        min: 5,
        max: 20,
      },
    ],
  },
  { timestamps: true }
);

export const Confession = mongoose.model<ConfessionDocument>("Confession", confessionSchema);
