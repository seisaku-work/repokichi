import { Schema, model, models } from "mongoose";

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
      enum: ["oc_visit", "mirai", "tokutaisei", "guardian", "online_oc", "individual"],
      required: true,
    },
    attendanceTypeName: { type: String, required: true, trim: true },
    sessionCode: {
      type: String,
      enum: ["morning", "afternoon", "other"],
      required: true,
    },
    sessionName: { type: String, required: true, trim: true },
    courseCode: {
      type: String,
      enum: ["beauty", "tb", "wp", "bs"],
      required: true,
    },
    courseName: { type: String, required: true, trim: true },
    groupsCount: { type: Number, default: 0 },
    peopleCount: { type: Number, default: 0 },
    sourceCampusLabel: { type: String, default: null, trim: true },
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
