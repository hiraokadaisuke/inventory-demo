'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { translateAuthError } from '@/lib/authErrors'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/admin/inventory')
    })
  }, [router])

  const handleSignup = async () => {
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(translateAuthError(error.message))
    } else {
      router.replace('/setup')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">サインアップ</h1>
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
      <Button className="w-full" onClick={handleSignup}>
        アカウント作成
      </Button>
    </div>
  )
}
