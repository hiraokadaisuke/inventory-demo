import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { user_id, name } = await req.json()
  if (!user_id) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 })
  }

  if (name) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: user_id, name })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }
  }

  const { error, data } = await supabase
    .from('warehouses')
    .insert({ user_id, name: 'メイン倉庫' })
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, data })
}
