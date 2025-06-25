"use client";
import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { savePreset } from '@/lib/presets'

interface ColumnDef {
  key: string
  label: string
}

export default function ColumnPresetModal({
  isOpen,
  onClose,
  columns,
  initialSelected,
  onSaved,
}: {
  isOpen: boolean
  onClose: () => void
  columns: ColumnDef[]
  initialSelected: string[]
  onSaved: () => void
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [name, setName] = useState('')

  useEffect(() => {
    setChecked(new Set(initialSelected))
  }, [initialSelected])

  const toggle = (k: string) => {
    setChecked(prev => {
      const n = new Set(prev)
      n.has(k) ? n.delete(k) : n.add(k)
      return n
    })
  }

  const handleSave = async () => {
    const { data } = await supabase.auth.getSession()
    const userId = data.session?.user.id
    if (!userId) return
    await savePreset(userId, name || 'noname', Array.from(checked))
    onSaved()
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded p-6 shadow-lg space-y-4">
          <Dialog.Title className="text-lg font-bold">カラムプリセット</Dialog.Title>

          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto pr-1">
            {columns.map(c => (
              <Label key={c.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checked.has(c.key)}
                  onChange={() => toggle(c.key)}
                />
                <span>{c.label}</span>
              </Label>
            ))}
          </div>

          <div>
            <Label className="mb-1 block">プリセット名</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>キャンセル</Button>
            <Button onClick={handleSave} className="bg-[#191970] text-white">保存</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
