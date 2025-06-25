import { supabase } from './supabase'

export async function savePreset(
  userId: string,
  name: string,
  visibleColumns: string[],
) {
  return supabase.from('column_presets').insert({
    user_id: userId,
    name,
    view_name: 'inventory',
    visible_columns: visibleColumns,
  })
}

export async function fetchLatestPreset(userId: string) {
  const { data } = await supabase
    .from('column_presets')
    .select('*')
    .eq('user_id', userId)
    .eq('view_name', 'inventory')
    .order('created_at', { ascending: false })
    .limit(1)
  return data?.[0] || null
}

export async function listPresets(userId: string) {
  const { data } = await supabase
    .from('column_presets')
    .select('*')
    .eq('user_id', userId)
    .eq('view_name', 'inventory')
    .order('created_at', { ascending: false })
  return data || []
}

export async function deletePreset(id: number) {
  return supabase.from('column_presets').delete().eq('id', id)
}
