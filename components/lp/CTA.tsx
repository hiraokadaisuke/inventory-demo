import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="bg-blue-600 text-white text-center py-16 px-4">
      <h2 className="text-2xl font-bold mb-4">資料請求・お問い合わせ</h2>
      <Button
        className="bg-black text-white hover:bg-zinc-800"
        asChild
      >
        <Link href="/contact">お問い合わせ</Link>
      </Button>
    </section>
  )
}
