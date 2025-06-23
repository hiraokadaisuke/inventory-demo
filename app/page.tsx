'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      {/* Heroセクション */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">パチ番頭</h1>
          <p className="text-xl text-gray-600 mb-8">
            パチンコホール向け在庫管理を<br className="sm:hidden" />もっとスマートに、もっと正確に。
          </p>
          <div className="flex justify-center mb-8">
            <Image
              src="/dashboard-image.png" // publicフォルダに画像を入れてください
              alt="パチ番頭画面イメージ"
              width={600}
              height={350}
              className="rounded-xl shadow"
            />
          </div>
          <Link
            href="/admin/inventory"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow"
          >
            在庫一覧を見る
          </Link>
        </div>
      </section>

      {/* メリットセクション */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">🔍 主なメリット</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: '一覧で見える',
              text: 'どの台がどの店舗にあるか、検索なしで一目瞭然。',
              icon: '📊',
            },
            {
              title: 'スマホ対応',
              text: 'スマホやタブレットで入力・検索がサクサク。',
              icon: '📱',
            },
            {
              title: '帳票・CSV出力',
              text: '行政報告や内部チェックに便利なデータ出力対応。',
              icon: '📝',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl shadow px-6 py-8 text-center hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 導入の流れ */}
      <section className="py-20 px-6 bg-blue-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">🚀 導入の流れ</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="text-3xl font-bold text-blue-600 mb-2">STEP 1</div>
            <p className="font-semibold mb-1">台帳データを登録</p>
            <p className="text-sm text-gray-600">CSV or 手動でかんたん登録</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="text-3xl font-bold text-blue-600 mb-2">STEP 2</div>
            <p className="font-semibold mb-1">現場で台の情報を更新</p>
            <p className="text-sm text-gray-600">スマホ入力でラクラク</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="text-3xl font-bold text-blue-600 mb-2">STEP 3</div>
            <p className="font-semibold mb-1">CSV出力や集計で活用</p>
            <p className="text-sm text-gray-600">報告・移動・監査にも対応</p>
          </div>
        </div>
      </section>
    </main>
  )
}
