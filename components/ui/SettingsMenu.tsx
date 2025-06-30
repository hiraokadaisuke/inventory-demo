'use client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SettingsMenu() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50">
  <Menu className="h-5 w-5" />
</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-48 rounded-md bg-white shadow-md border border-gray-200 z-50">
        <DropdownMenuItem
          className="hover:bg-gray-100 p-2 rounded"
          onClick={() => router.push('/warehouses')}
        >
          倉庫設定
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-gray-100 p-2 rounded"
          onClick={() => router.push('/settings/account')}
        >
          アカウント設定
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-100 p-2 rounded" onClick={handleLogout}>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
