'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
          <Button className="min-w-[8rem]" asChild><Link href="/signup">新規登録</Link></Button>
          <Button className="min-w-[8rem]" asChild><Link href="/login">ログイン</Link></Button>
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

