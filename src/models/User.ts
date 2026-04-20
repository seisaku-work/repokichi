import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    loginId: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    userName: { type: String, required: true, trim: true },
    roleCode: {
      type: String,
      required: true,
      enum: ["admin", "editor"],
      default: "editor",
    },
    departmentCode: { type: String, default: "pr" },
    departmentName: { type: String, default: "広報部" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.index({ loginId: 1 }, { unique: true });
UserSchema.index({ roleCode: 1, isActive: 1 });

export const User = models.User || model("User", UserSchema);
