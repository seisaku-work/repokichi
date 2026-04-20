async function getReport(id: string) {
  const res = await fetch(`http://localhost:3000/api/reports/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("日報詳細の取得に失敗しました");
  }

  return res.json();
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getReport(id);
  const data = result.data;

  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>日報詳細</h1>

      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <a href="/reports">← 一覧へ戻る</a>
      </div>

      <section style={{ marginBottom: "24px" }}>
        <h2>基本情報</h2>
        <p>日付: {new Date(data.report.reportDate).toLocaleDateString("ja-JP")}</p>
        <p>入力者: {data.report.authorName}</p>
        <p>代理入力: {data.report.proxyName || "-"}</p>
        <p>特記事項: {data.report.remarks || "-"}</p>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2>OC予約数</h2>
        {data.campusKpis.length === 0 ? (
          <p>データなし</p>
        ) : (
          <ul>
            {data.campusKpis.map((item: any) => (
              <li key={item._id}>
                {item.campusName}: {item.ocReservationsCurrent}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2>OCエントリー</h2>
        {data.ocEntries.length === 0 ? (
          <p>データなし</p>
        ) : (
          <ul>
            {data.ocEntries.map((item: any) => (
              <li key={item._id}>
                {new Date(item.eventDate).toLocaleDateString("ja-JP")} / {item.eventLabel} /{" "}
                {item.campusName} / {item.courseName} / {item.gradeLabel} /{" "}
                {item.categoryName} / {item.currentValue}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2>参加実績</h2>
        {data.attendances.length === 0 ? (
          <p>データなし</p>
        ) : (
          <ul>
            {data.attendances.map((item: any) => (
              <li key={item._id}>
                {item.campusName} / {item.attendanceTypeName} / {item.sessionName} /{" "}
                {item.courseName} / 組数: {item.groupsCount} / 人数: {item.peopleCount}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
