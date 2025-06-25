'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EditWarehousePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        setError(error.message)
      } else if (data) {
        setName(data.name || '')
        setAddress(data.address || '')
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleUpdate = async () => {
    setError(null)
    const { error } = await supabase
      .from('warehouses')
      .update({ name, address })
      .eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      router.push('/warehouses')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">倉庫編集</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input placeholder="名称" value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="住所" value={address} onChange={e => setAddress(e.target.value)} />
      <Button className="w-full" onClick={handleUpdate}>更新</Button>
    </div>
  )
}
