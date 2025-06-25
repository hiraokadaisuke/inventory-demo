'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import InventoryTable, { ColumnDef } from '@/components/ui/InventoryTable'
import EditModal from '@/components/EditModal'

export default function InventoryPage() {
  const router = useRouter()
  const [rows, setRows] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)

  // ------------- データ取得 -------------
  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.replace('/login')
      return
    }

    const { data, error } = await supabase
      .from('inventory')
      .select(
        'id,machine_name,type,quantity,created_at,warehouses(name)'
      )
      .eq('user_id', user.id)

    if (error) {
      console.error('fetch error:', error.message)
      return
    }
    setRows(data || [])
  }

  useEffect(() => {
    load()
  }, [router])

  // ------------- 保存（更新） -------------
  const handleSave = async (form: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || !form.id) return

    const { error } = await supabase
      .from('inventory')
      .update(form)
      .eq('id', form.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('update error:', error.message)
      return
    }
    setEditing(null)
    load()
  }

  // ------------- テーブル定義 -------------
  const columns: ColumnDef<any>[] = [
    { key: 'machine_name', label: '機種名' },
    { key: 'type', label: '型式名' },
    {
      key: 'warehouses',
      label: '倉庫名',
      render: (row) => row.warehouses?.name ?? '',
    },
    {
      key: 'created_at',
      label: '登録日',
      render: (row) =>
        new Date(row.created_at).toLocaleDateString('ja-JP'),
    },
    { key: 'quantity', label: '数量' },
  ]

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">在庫一覧</h1>

      <InventoryTable
        data={rows}
        columns={columns}
        /* 各行の「編集」ボタンが押されたらモーダルを開く */
        onEdit={(row) => setEditing(row)}
      />

      <EditModal
        isOpen={!!editing}
        data={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  )
}
