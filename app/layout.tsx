import './globals.css'

export const metadata = {
  title: '在庫管理ソフト',
  description: 'パチンコ在庫管理用のデモアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
