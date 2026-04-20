import { Schema, model, models } from "mongoose";

const OcEntrySchema = new Schema(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      required: true,
      index: true,
    },
    reportDate: { type: Date, required: true, index: true },
    eventDate: { type: Date, required: true, index: true },
    eventLabel: { type: String, required: true, trim: true },
    eventTypeCode: {
      type: String,
      default: "open_campus",
      trim: true,
    },
    campusCode: { type: String, required: true, trim: true },
    campusName: { type: String, required: true, trim: true },
    courseCode: {
      type: String,
      enum: ["beauty", "tb", "wp", "bs"],
      required: true,
    },
    courseName: { type: String, required: true, trim: true },
    gradeCode: {
      type: String,
      enum: ["high3", "high2", "high1"],
      required: true,
    },
    gradeLabel: { type: String, required: true, trim: true },
    categoryCode: {
      type: String,
      enum: ["new", "repeater"],
      required: true,
    },
    categoryName: { type: String, required: true, trim: true },
    currentValue: { type: Number, default: 0 },
    sourceCampusLabel: { type: String, default: null, trim: true },
  },
  { timestamps: true }
);

OcEntrySchema.index(
  {
    reportId: 1,
    eventDate: 1,
    campusCode: 1,
    courseCode: 1,
    gradeCode: 1,
    categoryCode: 1,
  },
  { unique: true }
);

export const OcEntry = models.OcEntry || model("OcEntry", OcEntrySchema);
