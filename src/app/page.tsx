export default function HomePage() {
  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>レポきち</h1>
      <p>セットアップ確認中です。</p>
      <ul>
        <li>POST /api/reports</li>
        <li>GET /api/reports</li>
        <li>GET /api/reports/:id</li>
      </ul>
    </main>
  );
}
