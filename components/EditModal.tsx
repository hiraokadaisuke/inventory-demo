// components/EditModal.tsx
'use client'

import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'


const initialForm = {
  installation: '', type: '', maker: '', machine_name: '', frame_color: '',
  board_serial: '', frame_serial: '', main_board_serial: '', installation_date: '',
  certificate_date: '', certificate_expiry: '', approval_date: '', approval_expiry: '',
  removal_date: '', elapsed_years: '', purchase_flag: '', usage_count: '',
  purchase_unit_price: '', purchase_total_price: '', sell_date: '', buyer: '',
  sell_unit_price: '', sell_total_price: '', status: '', note: '',
  warehouse_id: '', quantity: '',
}

const fieldLabels: Record<string, string> = {
  installation: '設置場所', type: '種別', maker: 'メーカー', machine_name: '機種名',
  frame_color: '枠色', board_serial: '遊技盤番号等', frame_serial: '枠番号',
  main_board_serial: '主基板番号等', installation_date: '設置日', certificate_date: '検定日',
  certificate_expiry: '検定期日', approval_date: '認定日', approval_expiry: '認定期日',
  removal_date: '撤去日', elapsed_years: '経過年数', purchase_flag: '購入',
  usage_count: '使用次', purchase_unit_price: '購入単価', purchase_total_price: '購入金額',
  sell_date: '売却日', buyer: '売却先', sell_unit_price: '売却単価',
  sell_total_price: '売却金額', status: '状況', note: '備考',
  warehouse_id: '倉庫', quantity: '数量',
}

export default function EditModal({ isOpen, onClose, onSave, data }: {
  isOpen: boolean
  onClose: () => void
  onSave: (form: any) => void
  data?: any
}) {
  const [formData, setFormData] = useState(initialForm)
  const [warehouses, setWarehouses] = useState<any[]>([])

  useEffect(() => {
    setFormData(data ? { ...initialForm, ...data } : initialForm)
  }, [data])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const userId = data.user?.id
      if (!userId) return
      const { data: ws } = await supabase
        .from('warehouses')
        .select('*')
        .eq('user_id', userId)
      setWarehouses(ws || [])
    })
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded p-6 shadow-lg space-y-4">
          <Dialog.Title className="text-lg font-bold">在庫情報を編集</Dialog.Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {Object.entries(initialForm).map(([key]) => (
              <div key={key}>
                <Label className="text-sm mb-1 block">{fieldLabels[key] || key}</Label>
                {key === 'warehouse_id' ? (
                  <select
                    name="warehouse_id"
                    value={formData.warehouse_id}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  >
                    <option value="">選択してください</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    name={key}
                    value={formData[key as keyof typeof formData] ?? ''}
                    onChange={handleChange}
                    type={key.includes('date') ? 'date' : key === 'quantity' ? 'number' : 'text'}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>キャンセル</Button>
            <Button onClick={() => onSave(formData)} className="bg-[#191970] text-white">
              保存
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
