'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SetupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
    })
  }, [router])

  const handleSetup = async () => {
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('ログインが必要です')
      return
    }
    if (!name.trim()) {
      setError('名前を入力してください')
      return
    }
    const res = await fetch('/api/create-default-warehouse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, name }),
    })
    const result = await res.json()
    if (result.error) {
      setError(result.error)
      return
    }
    router.replace('/admin/inventory')
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">初期設定</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        placeholder="お名前"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button className="w-full" onClick={handleSetup}>登録</Button>
    </div>
  )
}
