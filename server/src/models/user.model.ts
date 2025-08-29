import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  password: string;
  confessions: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Confession",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        unique: true,
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
