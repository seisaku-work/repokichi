import { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
  {
    reportDate: { type: Date, required: true, index: true },
    departmentCode: { type: String, default: "pr" },
    departmentName: { type: String, default: "広報部" },
    authorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authorName: { type: String, required: true, trim: true },
    proxyUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    proxyName: { type: String, default: null, trim: true },
    remarks: { type: String, default: null },
    status: { type: String, default: "active" },
    sourceType: {
      type: String,
      enum: ["manual", "import"],
      default: "manual",
    },
    rawSourceFileName: { type: String, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

ReportSchema.index(
  { reportDate: 1, departmentCode: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  }
);

export const Report = models.Report || model("Report", ReportSchema);
