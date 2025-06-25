'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function FAQ() {
  const faqs = [
    { q: 'サービスの利用を開始するには？', a: 'まず /signup からアカウントを作成してください。' },
    { q: 'CSV インポートは可能ですか？', a: 'はい、台帳データをCSV形式でインポートできます。' },
    { q: 'スマホ対応していますか？', a: 'スマートフォンやタブレットでも快適にご利用いただけます。' },
  ]
  return (
    <section className="py-12 px-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">よくある質問</h2>
      <Accordion type="single" collapsible className="max-w-2xl mx-auto">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
