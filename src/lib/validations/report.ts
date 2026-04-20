import { z } from "zod";

export const campusKpiSchema = z.object({
  campusCode: z.string().min(1),
  campusName: z.string().min(1),
  ocReservationsCurrent: z.number().int().min(0),
  sourceCampusLabel: z.string().nullable().optional(),
});

export const ocEntrySchema = z.object({
  eventDate: z.string().min(1),
  eventLabel: z.string().min(1),
  eventTypeCode: z.string().default("open_campus"),

  campusCode: z.string().min(1),
  campusName: z.string().min(1),

  courseCode: z.enum(["beauty", "tb", "wp", "bs"]),
  courseName: z.string().min(1),

  gradeCode: z.enum(["high3", "high2", "high1"]),
  gradeLabel: z.string().nullable().optional(),

  categoryCode: z.enum(["new", "repeater"]),
  categoryName: z.string().min(1),

  currentValue: z.number().int().min(0),
  sourceCampusLabel: z.string().nullable().optional(),
});

export const attendanceSchema = z.object({
  campusCode: z.string().min(1),
  campusName: z.string().min(1),

  attendanceTypeCode: z.enum([
    "oc_visit",
    "mirai",
    "tokutaisei",
    "guardian",
    "online_oc",
    "individual",
  ]),
  attendanceTypeName: z.string().min(1),

  sessionCode: z.enum(["morning", "afternoon", "other"]),
  sessionName: z.string().min(1),

  courseCode: z.enum(["beauty", "tb", "wp", "bs"]),
  courseName: z.string().min(1),

  groupsCount: z.number().int().min(0),
  peopleCount: z.number().int().min(0),

  sourceCampusLabel: z.string().nullable().optional(),
  rawText: z.string().nullable().optional(),
});

export const createReportSchema = z.object({
  reportDate: z.string().min(1),
  departmentCode: z.string().default("pr"),
  departmentName: z.string().default("広報部"),
  authorName: z.string().min(1),
  proxyName: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
  sourceType: z.enum(["manual", "import"]).default("manual"),
  rawSourceFileName: z.string().nullable().optional(),

  campusKpis: z.array(campusKpiSchema).default([]),
  ocEntries: z.array(ocEntrySchema).default([]),
  attendances: z.array(attendanceSchema).default([]),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
