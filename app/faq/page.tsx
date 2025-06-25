'use client'

export default function FAQPage() {
  const faqs = [
    {
      q: 'サービスの利用を開始するには？',
      a: 'まず /signup からアカウントを作成し、ログイン後に表示される /setup でプロフィールを登録します。初回設定が完了すると自動的に "メイン倉庫" が作成されます。'
    },
    {
      q: 'ログインメールが届きません。',
      a: '迷惑メールフォルダに振り分けられていないかご確認ください。それでも届かない場合は時間を置いて再度お試しください。'
    },
    {
      q: 'CSV インポートで文字化けします。',
      a: 'CSV ファイルは UTF-8 で保存してください。Excel から出力する場合は "UTF-8" 形式で保存することで回避できます。'
    },
    {
      q: 'スマートフォンで表示が崩れます。',
      a: '最新のブラウザをご利用ください。画面サイズが極端に小さい端末では表示が最適化されない場合があります。'
    },
    {
      q: 'データを誤って削除してしまいました。',
      a: 'バックアップからの復元はできません。誤削除を防ぐため、操作は慎重に行ってください。'
    },
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">よくある質問</h1>
      {faqs.map((item, idx) => (
        <div key={idx} className="border rounded-lg p-4 bg-white shadow">
          <p className="font-semibold">{item.q}</p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{item.a}</p>
        </div>
      ))}
    </div>
  )
}
