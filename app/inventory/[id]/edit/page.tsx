'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EditModal from '@/components/EditModal'

export default function InventoryEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [record, setRecord] = useState<any | null>(null)

  const id = Number(params.id)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (error || !data) {
        router.replace('/inventory')
        return
      }
      setRecord(data)
      setLoading(false)
    }
    load()
  }, [id, router])

  const handleSave = async (form: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }
    await supabase
      .from('inventory')
      .update(form)
      .eq('id', id)
      .eq('user_id', user.id)
    router.replace('/inventory')
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <EditModal
      isOpen={true}
      onClose={() => router.replace('/inventory')}
      onSave={handleSave}
      data={record}
    />
  )
}
