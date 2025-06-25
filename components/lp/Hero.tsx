'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">パチ番頭</h1>
        <p className="text-lg mb-8">パチンコホール向け在庫管理をもっとスマートに、もっと正確に。</p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button className="min-w-[8rem]" asChild>
            <Link href="/signup">新規登録</Link>
          </Button>
          <Button className="min-w-[8rem]" variant="outline" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
