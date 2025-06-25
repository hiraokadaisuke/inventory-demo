'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, FolderDown, ScanBarcode } from 'lucide-react'

export default function Functions() {
  const items = [
    {
      icon: Settings,
      title: '台帳管理',
      text: '在庫台の状態や履歴を一元管理'
    },
    {
      icon: ScanBarcode,
      title: 'バーコード入力',
      text: 'スマホカメラでバーコードを読み取り'
    },
    {
      icon: FolderDown,
      title: 'CSV出力',
      text: '各種帳票に使えるデータを簡単エクスポート'
    },
  ]
  return (
    <section className="py-12 px-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">機能紹介</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <Card key={i} className="text-center">
            <CardHeader>
              <item.icon className="w-10 h-10 mx-auto text-blue-600" />
              <CardTitle className="mt-2 text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{item.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
