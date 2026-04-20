"use client";

import { useState } from "react";

export default function NewReportPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      reportDate: formData.get("reportDate"),
      departmentCode: "pr",
      departmentName: "広報部",
      authorName: formData.get("authorName"),
      proxyName: formData.get("proxyName"),
      remarks: formData.get("remarks"),
      sourceType: "manual",
      campusKpis: [
        {
          campusCode: "osaka",
          campusName: "大阪校",
          ocReservationsCurrent: Number(formData.get("osakaOc") || 0),
        },
        {
          campusCode: "kobe",
          campusName: "神戸校",
          ocReservationsCurrent: Number(formData.get("kobeOc") || 0),
        },
      ],
      ocEntries: [
        {
          eventDate: formData.get("eventDate"),
          eventLabel: formData.get("eventLabel"),
          eventTypeCode: "open_campus",
          campusCode: "osaka",
          campusName: "大阪校",
          courseCode: "beauty",
          courseName: "美容科",
          gradeCode: "high3",
          gradeLabel: "高3生",
          categoryCode: "new",
          categoryName: "新規",
          currentValue: Number(formData.get("ocCurrentValue") || 0),
        },
      ],
      attendances: [
        {
          campusCode: "osaka",
          campusName: "大阪校",
          attendanceTypeCode: "oc_visit",
          attendanceTypeName: "午前・午後",
          sessionCode: "morning",
          sessionName: "午前",
          courseCode: "beauty",
          courseName: "美容科",
          groupsCount: Number(formData.get("groupsCount") || 0),
          peopleCount: Number(formData.get("peopleCount") || 0),
        },
      ],
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("保存成功");
        form.reset();
      } else {
        setMessage(
          "保存失敗: " +
            (data.message || "エラー") +
            (data.error ? " / " + data.error : "")
        );
      }
    } catch (error: any) {
      setMessage("通信エラー: " + (error?.message || "unknown"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: "24px",
        fontFamily: "sans-serif",
        maxWidth: "720px",
      }}
    >
      <h1>日報新規作成</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "12px", marginTop: "24px" }}
      >
        <label>
          日付
          <br />
          <input name="reportDate" type="date" required />
        </label>

        <label>
          入力者名
          <br />
          <input name="authorName" type="text" required />
        </label>

        <label>
          代理入力者名
          <br />
          <input name="proxyName" type="text" />
        </label>

        <label>
          特記事項
          <br />
          <textarea name="remarks" rows={4} />
        </label>

        <hr />

        <h2>OC予約数</h2>

        <label>
          大阪校
          <br />
          <input name="osakaOc" type="number" min="0" defaultValue={0} />
        </label>

        <label>
          神戸校
          <br />
          <input name="kobeOc" type="number" min="0" defaultValue={0} />
        </label>

        <hr />

        <h2>OCエントリー</h2>

        <label>
          イベント日
          <br />
          <input name="eventDate" type="date" required />
        </label>

        <label>
          イベント名
          <br />
          <input
            name="eventLabel"
            type="text"
            defaultValue="オープンキャンパス"
            required
          />
        </label>

        <label>
          新規人数
          <br />
          <input name="ocCurrentValue" type="number" min="0" defaultValue={0} />
        </label>

        <hr />

        <h2>参加実績</h2>

        <label>
          組数
          <br />
          <input name="groupsCount" type="number" min="0" defaultValue={0} />
        </label>

        <label>
          人数
          <br />
          <input name="peopleCount" type="number" min="0" defaultValue={0} />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "160px", height: "40px" }}
        >
          {loading ? "保存中..." : "保存する"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
