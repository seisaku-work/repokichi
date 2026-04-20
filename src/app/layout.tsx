export const metadata = {
  title: "レポきち",
  description: "広報部日報蓄積・帳票出力システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
