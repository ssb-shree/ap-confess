import mongoose, { Document, Schema } from "mongoose";
import { INTERNAL_SERVER_ERROR } from "../constants/status-codes";
import ApiError from "../utils/apiError";

export interface CommentDocument extends Document {
  message: string;
  userID: Schema.Types.ObjectId; // ID of user who wrote this comment
  likes: Schema.Types.ObjectId[]; //ID of users who liked this comment
  dislikes: Schema.Types.ObjectId[]; //ID of users who disliked this comment
  confessionID: Schema.Types.ObjectId; // ID of confession this comment was made on
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
  },
  { timestamps: true }
);

commentSchema.post("findOneAndUpdate", async function (doc: CommentDocument) {
  if (!doc) return;

  try {
    if (doc.dislikes.length > Number(process.env.THRESHOLD_COMMENT!)) {
      const count = doc.dislikes.length;

      console.log(count, "outside if");
      if (count > 2) {
        console.log(count, "inside if");
        // remove the comment from confession
        await mongoose.model("Confession").findByIdAndUpdate(doc.confessionID, {
          $pull: { comments: doc._id },
        });
        // remove the comment from user
        await mongoose.model("User").findByIdAndUpdate(doc.userID, {
          $pull: { comments: doc._id },
        });
        // delete the comment
        await doc.deleteOne();
      }
    }
  } catch (error: any) {
    throw new ApiError(INTERNAL_SERVER_ERROR, error.message);
  }
});

export const Comment = mongoose.model("Comment", commentSchema);
