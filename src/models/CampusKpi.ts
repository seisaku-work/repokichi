import { Schema, model, models } from "mongoose";

const CampusKpiSchema = new Schema(
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
    ocReservationsCurrent: { type: Number, default: 0 },
    sourceCampusLabel: { type: String, default: null, trim: true },
  },
  { timestamps: true }
);

CampusKpiSchema.index(
  { reportId: 1, campusCode: 1 },
  { unique: true }
);

export const CampusKpi =
  models.CampusKpi || model("CampusKpi", CampusKpiSchema);
