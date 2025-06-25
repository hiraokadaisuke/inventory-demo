'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (!user) {
        router.replace('/login')
        return
      }
      setEmail(user.email || '')
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()
      setName(profile?.name || '')
      setLoading(false)
    }
    load()
  }, [router])

  const handleUpdate = async () => {
    setError(null)
    setMessage(null)
    const { data } = await supabase.auth.getSession()
    const userId = data.session?.user.id
    if (!userId) {
      router.replace('/login')
      return
    }
    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId)
    if (error) {
      setError(error.message)
    } else {
      setMessage('更新しました')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">アカウント設定</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}
      <Input type="email" value={email} readOnly className="bg-gray-100" />
      <Input placeholder="お名前" value={name} onChange={e => setName(e.target.value)} />
      <Button className="w-full" onClick={handleUpdate}>更新</Button>
    </div>
  )
}
