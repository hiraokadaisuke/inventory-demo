"use client";
import { useEffect, useState, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import { WarehouseContext } from './WarehouseContext'

export default function WarehouseSelect() {
  const { selectedWarehouseId, setSelectedWarehouseId } = useContext(WarehouseContext)
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
      className="border px-3 py-[6px] h-[38px] rounded"
      value={selectedWarehouseId ?? ''}
      onChange={e => setSelectedWarehouseId(e.target.value || null)}
    >
      <option value="">全倉庫</option>
      {warehouses.map(w => (
        <option key={w.id} value={w.id}>{w.name}</option>
      ))}
    </select>
  )
}
