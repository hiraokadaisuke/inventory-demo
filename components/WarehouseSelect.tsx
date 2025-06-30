'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  selected: string
  onChange: (id: string) => void
}

export default function WarehouseSelect({ selected, onChange }: Props) {
  const [warehouses, setWarehouses] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id
      if (!userId) return

      const { data: ws } = await supabase
        .from('warehouses')
        .select('id, name')
        .eq('user_id', userId)

      setWarehouses(ws || [])
    })
  }, [])

  return (
    <select
      value={selected}
      onChange={(e) => {
        console.log('✅ 選択された倉庫ID:', e.target.value)
        onChange(e.target.value)
      }}
      className="border px-2 py-1 rounded"
    >
      <option value="all">全倉庫</option>
      {warehouses.map((w) => (
        <option key={w.id} value={w.id}>
          {w.name}
        </option>
      ))}
    </select>
  )
}
