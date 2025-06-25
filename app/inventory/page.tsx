'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function InventoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      const { data } = await supabase
        .from('inventory')
        .select('*, warehouses(name)')
        .eq('user_id', user.id)
      setItems(data || [])
    }
    load()
  }, [router])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">在庫一覧</h1>
      <table className="border w-full">
        <thead>
          <tr>
            <th className="border p-2">機種名</th>
            <th className="border p-2">倉庫</th>
            <th className="border p-2">数量</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} className="border">
              <td className="border p-2">{i.machine_name}</td>
              <td className="border p-2">{i.warehouses?.name || '-'}</td>
              <td className="border p-2">{i.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
