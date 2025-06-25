'use client'

import { Package, Smartphone, FileText } from 'lucide-react'

export default function Features() {
  const items = [
    { icon: Package, title: '一覧で見える', text: 'どの台がどの店舗にあるか一目瞭然' },
    { icon: Smartphone, title: 'スマホ対応', text: 'スマホやタブレットから素早く入力' },
    { icon: FileText, title: '帳票・CSV出力', text: '行政報告や内部チェックに便利なデータ出力' },
  ]
  return (
    <section className="py-12 px-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">サービスの特徴</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-6 text-center shadow">
            <item.icon className="w-10 h-10 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
