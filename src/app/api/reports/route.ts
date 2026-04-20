import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { CampusKpi } from "@/models/CampusKpi";
import { OcEntry } from "@/models/OcEntry";
import { Attendance } from "@/models/Attendance";

export async function GET(req: Request) {
  await connectMongo();

  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const filter: any = { deletedAt: null };

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

export async function POST(req: Request) {
  await connectMongo();

  try {
    const body = await req.json();

    const report = await Report.create({
      reportDate: new Date(body.reportDate),
      departmentCode: body.departmentCode ?? "pr",
      departmentName: body.departmentName ?? "広報部",
      authorName: body.authorName,
      proxyName: body.proxyName ?? null,
      remarks: body.remarks ?? null,
      sourceType: body.sourceType ?? "manual",
    });

    if (body.campusKpis?.length) {
      await CampusKpi.insertMany(
        body.campusKpis.map((item: any) => ({
          reportId: report._id,
          reportDate: new Date(body.reportDate),
          campusCode: item.campusCode,
          campusName: item.campusName,
          ocReservationsCurrent: item.ocReservationsCurrent ?? 0,
        }))
      );
    }

    if (body.ocEntries?.length) {
      await OcEntry.insertMany(
        body.ocEntries.map((item: any) => ({
          reportId: report._id,
          reportDate: new Date(body.reportDate),
          eventDate: new Date(item.eventDate),
          eventLabel: item.eventLabel,
          eventTypeCode: item.eventTypeCode ?? "open_campus",
          campusCode: item.campusCode,
          campusName: item.campusName,
          courseCode: item.courseCode,
          courseName: item.courseName,
          gradeCode: item.gradeCode,
          gradeLabel: item.gradeLabel,
          categoryCode: item.categoryCode,
          categoryName: item.categoryName,
          currentValue: item.currentValue ?? 0,
        }))
      );
    }

    if (body.attendances?.length) {
      await Attendance.insertMany(
        body.attendances.map((item: any) => ({
          reportId: report._id,
          reportDate: new Date(body.reportDate),
          campusCode: item.campusCode,
          campusName: item.campusName,
          attendanceTypeCode: item.attendanceTypeCode,
          attendanceTypeName: item.attendanceTypeName,
          sessionCode: item.sessionCode,
          sessionName: item.sessionName,
          courseCode: item.courseCode,
          courseName: item.courseName,
          groupsCount: item.groupsCount ?? 0,
          peopleCount: item.peopleCount ?? 0,
          rawText: item.rawText ?? null,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      message: "日報を保存しました",
      data: { reportId: report._id },
    });
  } catch (error: any) {
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
