'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface Warehouse {
  id: number
  name: string
  address: string | null
}

export default function WarehousesPage() {
  const router = useRouter()
  const [warehouses, setWarehouses] = useState<(Warehouse & { count: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      const userId = data.session?.user.id
      if (!userId) {
        router.replace('/login')
        return
      }
      const { data: list, error } = await supabase
        .from('warehouses')
        .select('id, name, address')
        .eq('user_id', userId)

      if (!error && list) {
        const withCounts = await Promise.all(
          list.map(async (w) => {
            const { count } = await supabase
              .from('inventory')
              .select('*', { count: 'exact', head: true })
              .eq('warehouse_id', w.id)
            return { ...w, count: count || 0 }
          })
        )
        setWarehouses(withCounts)
      }
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">倉庫一覧</h1>
        <Link href="/warehouses/new">
          <Button className="bg-[#191970] text-white hover:bg-[#15155d]">
            倉庫を追加
          </Button>
        </Link>
      </div>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">名称</th>
            <th className="border px-2 py-1">住所</th>
            <th className="border px-2 py-1">在庫数</th>
            <th className="border px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((w) => (
            <tr key={w.id}>
              <td className="border px-2 py-1">{w.name}</td>
              <td className="border px-2 py-1">{w.address ?? ''}</td>
              <td className="border px-2 py-1 text-right">{w.count}</td>
              <td className="border px-2 py-1 text-center">
                <Link href={`/warehouses/${w.id}/edit`}>
                  <Button size="sm">編集</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
