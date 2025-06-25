'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function Testimonials() {
  const voices = [
    { name: '東京ホール様', text: '在庫確認がすぐにできるようになり、作業効率が向上しました。' },
    { name: '大阪ホール様', text: 'スマホ対応で現場スタッフも使いやすいと好評です。' },
  ]
  return (
    <section className="py-12 px-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">利用者の声</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {voices.map((v, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-2">{v.text}</p>
              <p className="text-right font-semibold">{v.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
