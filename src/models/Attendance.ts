import mongoose, { Schema, model, models } from "mongoose";

const AttendanceSchema = new Schema(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      required: true,
      index: true,
    },
    reportDate: { type: Date, required: true, index: true },

    campusCode: { type: String, required: true, trim: true },
    campusName: { type: String, required: true, trim: true },

    attendanceTypeCode: {
      type: String,
      required: true,
      enum: [
        "oc_visit",
        "mirai",
        "tokutaisei",
        "guardian",
        "online_oc",
        "individual",
      ],
    },
    attendanceTypeName: { type: String, required: true },

    sessionCode: {
      type: String,
      required: true,
      enum: ["morning", "afternoon", "other"],
    },
    sessionName: { type: String, required: true },

    courseCode: {
      type: String,
      required: true,
      enum: ["beauty", "tb", "wp", "bs"],
    },
    courseName: { type: String, required: true },

    groupsCount: { type: Number, required: true, default: 0, min: 0 },
    peopleCount: { type: Number, required: true, default: 0, min: 0 },

    sourceCampusLabel: { type: String, default: null },
    rawText: { type: String, default: null },
  },
  { timestamps: true }
);

AttendanceSchema.index(
  {
    reportId: 1,
    campusCode: 1,
    attendanceTypeCode: 1,
    sessionCode: 1,
    courseCode: 1,
  },
  { unique: true }
);

export const Attendance =
  models.Attendance || model("Attendance", AttendanceSchema);
