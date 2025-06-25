'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function DashboardNav() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="flex items-center gap-4 p-4 border-b bg-gray-50">
      <Link href="/admin/inventory" className="font-semibold">
        在庫
      </Link>
      <Link href="/warehouses" className="font-semibold">
        倉庫
      </Link>
      <Link href="/settings/account" className="font-semibold">
        アカウント設定
      </Link>
      <div className="flex-1" />
      <Button variant="outline" onClick={handleLogout}>
        ログアウト
      </Button>
    </nav>
  )
}
