'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (code) {
      setLoading(true)
      supabase.auth.exchangeCodeForSession(code).then(async ({ error }) => {
        if (error) {
          setError(error.message)
          setLoading(false)
          return
        }
        await supabase.auth.getSession()
        router.replace('/setup')
      })
      return
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/setup')
    })
  }, [router, code])

  const handleLogin = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.replace('/setup')
    }
  }

  if (loading || code) {
    return (
      <div className="mt-20 text-center space-y-2">
        <p>ログイン中です...</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">ログイン</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button className="w-full" onClick={handleLogin}>ログイン</Button>
    </div>
  )
}
