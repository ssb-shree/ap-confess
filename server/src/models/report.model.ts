import mongoose, { Document, Schema } from "mongoose";

export interface ReportDocument extends Document {
  confessionID: mongoose.Types.ObjectId; // which confession is reported
  reporterID: mongoose.Types.ObjectId; // who reported it
  reason: string; // reason for report
  createdAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    confessionID: {
      type: Schema.Types.ObjectId,
      ref: "Confession",
      required: true,
    },
    reporterID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent duplicate reports from same user on same confession
reportSchema.index({ confessionID: 1, reporterID: 1 }, { unique: true });

export const Report = mongoose.model<ReportDocument>("Report", reportSchema);
