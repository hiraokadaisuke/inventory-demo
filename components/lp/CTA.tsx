'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-12 px-6 bg-blue-600 text-white text-center">
      <h2 className="text-2xl font-bold mb-4">資料請求・お問い合わせ</h2>
      <Button className="min-w-[8rem]" asChild><Link href="/contact">お問い合わせ</Link></Button>
    </section>
  )
}
