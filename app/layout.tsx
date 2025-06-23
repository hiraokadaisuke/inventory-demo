import './globals.css'
import Head from 'next/head'

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
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
