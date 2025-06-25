'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function NewWarehousePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    setError(null)
    const { data } = await supabase.auth.getSession()
    const userId = data.session?.user.id
    if (!userId) {
      router.replace('/login')
      return
    }
    if (!name.trim()) {
      setError('名称を入力してください')
      return
    }
    const { error } = await supabase.from('warehouses').insert({
      user_id: userId,
      name,
      address: address || null,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/warehouses')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">倉庫追加</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input placeholder="名称" value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="住所" value={address} onChange={e => setAddress(e.target.value)} />
      <Button className="w-full" onClick={handleCreate}>登録</Button>
    </div>
  )
}
