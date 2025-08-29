import mongoose, { Document, Schema } from "mongoose";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
  confessions: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
  comparePassword(value: string): Promise<boolean>;
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
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (pass: string) {
  return await comparePassword(pass, this.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
