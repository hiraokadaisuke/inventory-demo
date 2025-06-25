'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import InventoryTable, { ColumnDef } from '@/components/ui/InventoryTable'
import EditModal from '@/components/EditModal'

export default function InventoryPage() {
  const router = useRouter()
  const [rows, setRows] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }
    const { data, error } = await supabase
      .from('inventory')
      .select('id,machine_name,type,warehouses(name),created_at,quantity')
      .eq('user_id', user.id)
    if (!error && data) setRows(data)
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async (form: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !form.id) return
    await supabase
      .from('inventory')
      .update(form)
      .eq('id', form.id)
      .eq('user_id', user.id)
    setEditing(null)
    fetchData()
  }

  const columns: ColumnDef<any>[] = [
    { key: 'machine_name', label: '台名' },
    { key: 'type', label: '型式名' },
    {
      key: 'warehouses',
      label: '倉庫名',
      render: (row) => row.warehouses?.name || ''
    },
    {
      key: 'created_at',
      label: '登録日',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
    { key: 'quantity', label: '数量' },
  ]

  return (
    <div className="p-4 space-y-4">
      <InventoryTable
        data={rows}
        columns={columns}
        onEdit={(row) => setEditing(row)}
      />
      <EditModal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        data={editing || undefined}
      />
    </div>
  )
}
