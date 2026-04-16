import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { createReportSchema } from "@/lib/validations/report";
import { Report } from "@/models/Report";
import { CampusKpi } from "@/models/CampusKpi";
import { OcEntry } from "@/models/OcEntry";
import { Attendance } from "@/models/Attendance";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await connectMongo();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const json = await req.json();
    const parsed = createReportSchema.parse(json);

    const report = await Report.create(
      [
        {
          reportDate: new Date(parsed.reportDate),
          departmentCode: parsed.departmentCode,
          departmentName: parsed.departmentName,
          authorName: parsed.authorName,
          proxyName: parsed.proxyName ?? null,
          remarks: parsed.remarks ?? null,
          sourceType: parsed.sourceType,
          rawSourceFileName: parsed.rawSourceFileName ?? null,
        },
      ],
      { session }
    );

    const reportDoc = report[0];

    if (parsed.campusKpis.length > 0) {
      await CampusKpi.insertMany(
        parsed.campusKpis.map((item) => ({
          reportId: reportDoc._id,
          reportDate: new Date(parsed.reportDate),
          campusCode: item.campusCode,
          campusName: item.campusName,
          ocReservationsCurrent: item.ocReservationsCurrent,
          sourceCampusLabel: item.sourceCampusLabel ?? null,
        })),
        { session }
      );
    }

    if (parsed.ocEntries.length > 0) {
      await OcEntry.insertMany(
        parsed.ocEntries.map((item) => ({
          reportId: reportDoc._id,
          reportDate: new Date(parsed.reportDate),
          eventDate: new Date(item.eventDate),
          eventLabel: item.eventLabel,
          eventTypeCode: item.eventTypeCode,
          campusCode: item.campusCode,
          campusName: item.campusName,
          courseCode: item.courseCode,
          courseName: item.courseName,
          gradeCode: item.gradeCode,
          gradeLabel: item.gradeLabel ?? null,
          categoryCode: item.categoryCode,
          categoryName: item.categoryName,
          currentValue: item.currentValue,
          sourceCampusLabel: item.sourceCampusLabel ?? null,
        })),
        { session }
      );
    }

    if (parsed.attendances.length > 0) {
      await Attendance.insertMany(
        parsed.attendances.map((item) => ({
          reportId: reportDoc._id,
          reportDate: new Date(parsed.reportDate),
          campusCode: item.campusCode,
          campusName: item.campusName,
          attendanceTypeCode: item.attendanceTypeCode,
          attendanceTypeName: item.attendanceTypeName,
          sessionCode: item.sessionCode,
          sessionName: item.sessionName,
          courseCode: item.courseCode,
          courseName: item.courseName,
          groupsCount: item.groupsCount,
          peopleCount: item.peopleCount,
          sourceCampusLabel: item.sourceCampusLabel ?? null,
          rawText: item.rawText ?? null,
        })),
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      message: "日報を保存しました",
      data: {
        reportId: reportDoc._id,
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "日報保存に失敗しました",
        error: error?.message ?? "Unknown error",
      },
      { status: 400 }
    );
  }
}
export async function GET(req: Request) {
  await connectMongo();

  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const filter: any = {
      deletedAt: null,
    };

    if (dateFrom || dateTo) {
      filter.reportDate = {};
      if (dateFrom) filter.reportDate.$gte = new Date(dateFrom);
      if (dateTo) filter.reportDate.$lte = new Date(dateTo);
    }

    const reports = await Report.find(filter)
      .sort({ reportDate: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "日報一覧取得に失敗しました",
        error: error?.message ?? "Unknown error",
      },
      { status: 400 }
    );
  }
}
