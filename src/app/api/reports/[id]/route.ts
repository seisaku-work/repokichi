import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { CampusKpi } from "@/models/CampusKpi";
import { OcEntry } from "@/models/OcEntry";
import { Attendance } from "@/models/Attendance";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: Params) {
  await connectMongo();

  try {
    const { id } = await params;

    const report = await Report.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "日報が見つかりません",
        },
        { status: 404 }
      );
    }

    const [campusKpis, ocEntries, attendances] = await Promise.all([
      CampusKpi.find({ reportId: id }).sort({ campusCode: 1 }).lean(),
      OcEntry.find({ reportId: id })
        .sort({
          eventDate: 1,
          campusCode: 1,
          courseCode: 1,
          gradeCode: 1,
          categoryCode: 1,
        })
        .lean(),
      Attendance.find({ reportId: id })
        .sort({
          campusCode: 1,
          attendanceTypeCode: 1,
          sessionCode: 1,
          courseCode: 1,
        })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        report,
        campusKpis,
        ocEntries,
        attendances,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "日報詳細取得に失敗しました",
        error: error?.message ?? "Unknown error",
      },
      { status: 400 }
    );
  }
}
