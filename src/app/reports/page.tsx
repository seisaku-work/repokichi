async function getReports() {
  const res = await fetch("http://localhost:3000/api/reports", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("日報一覧の取得に失敗しました");
  }

  return res.json();
}

export default async function ReportsPage() {
  const result = await getReports();
  const reports = result.data ?? [];

  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>日報一覧</h1>

      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <a href="/reports/new">＋ 新規作成へ</a>
      </div>

      {reports.length === 0 ? (
        <p>まだ日報がありません。</p>
      ) : (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>日付</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>入力者</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>代理入力</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>特記事項</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report: any) => (
              <tr key={report._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <a href={`/reports/${report._id}`}>
                    {new Date(report.reportDate).toLocaleDateString("ja-JP")}
                  </a>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {report.authorName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {report.proxyName || "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {report.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
