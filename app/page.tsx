import Link from 'next/link'

export default function Page() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>ようこそ！在庫管理ソフトへ</h1>
      <p>このページは仮のトップページです。</p>

      <p style={{ marginTop: '2rem' }}>
        👉 <Link href="/admin/inventory">在庫一覧ページへ移動</Link>
      </p>
    </main>
  )
}
