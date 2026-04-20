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
    eventTypeCode: { type: String, default: "open_campus" },

    campusCode: { type: String, required: true, trim: true },
    campusName: { type: String, required: true, trim: true },

    courseCode: {
      type: String,
      required: true,
      enum: ["beauty", "tb", "wp", "bs"],
    },
    courseName: { type: String, required: true },

    gradeCode: {
      type: String,
      required: true,
      enum: ["high3", "high2", "high1"],
    },
    gradeLabel: { type: String, default: null },

    categoryCode: {
      type: String,
      required: true,
      enum: ["new", "repeater"],
    },
    categoryName: { type: String, required: true },

    currentValue: { type: Number, required: true, default: 0, min: 0 },
    sourceCampusLabel: { type: String, default: null },
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
