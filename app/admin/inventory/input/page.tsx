'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const initialForm = {
  installation: '', type: '', maker: '', machine_name: '', frame_color: '',
  board_serial: '', frame_serial: '', main_board_serial: '', installation_date: '',
  certificate_date: '', certificate_expiry: '', approval_date: '', approval_expiry: '',
  removal_date: '', elapsed_years: '', purchase_flag: '', usage_count: '',
  purchase_unit_price: '', purchase_total_price: '', sell_date: '', buyer: '',
  sell_unit_price: '', sell_total_price: '', status: '', note: '', pdf_url: '',
}

const fieldLabels: { [key: string]: string } = {
  installation: '設置場所', type: '種別', maker: 'メーカー', machine_name: '機種名',
  frame_color: '枠色', board_serial: '遊技盤番号等', frame_serial: '枠番号',
  main_board_serial: '主基板番号等', installation_date: '設置日', certificate_date: '検定日',
  certificate_expiry: '検定期日', approval_date: '認定日', approval_expiry: '認定期日',
  removal_date: '撤去日', elapsed_years: '経過年数', purchase_flag: '購入',
  usage_count: '使用次', purchase_unit_price: '購入単価', purchase_total_price: '購入金額',
  sell_date: '売却日', buyer: '売却先', sell_unit_price: '売却単価',
  sell_total_price: '売却金額', status: '状況', note: '備考', pdf_url: 'PDFファイルURL'
}

const selectOptions: { [key: string]: string[] } = {
  installation: ['倉庫', '設置'],
}

export default function InventoryInputOnly() {
  const [formData, setFormData] = useState(initialForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAdd = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('ログイン情報を取得できません')
      return
    }

    const payload = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v])
    )

    const { error } = await supabase
      .from('inventory')
      .insert([{ ...payload, user_id: user.id }])

    if (error) {
      alert('保存に失敗しました')
      console.error(error)
    } else {
      alert('保存しました')
      setFormData(initialForm)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const form = new FormData()
    form.append('file', file)

    const res = await fetch('/api/upload-ocr', {
      method: 'POST',
      body: form,
    })
    const result = await res.json()

    if (result.success && result.inserted) {
      const {
        maker,
        machine_name,
        certificate_date,
        board_serial,
        frame_serial,
        main_board_serial,
        note,
      } = result.inserted

      setFormData(prev => ({
        ...prev,
        maker,
        machine_name,
        certificate_date,
        board_serial,
        frame_serial,
        main_board_serial,
        note,
      }))

      alert('OCRから自動入力しました')
    } else {
      alert('OCR失敗: ' + result.error)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card className="p-6 space-y-6">
        <div className="border rounded p-4 bg-gray-50 space-y-2">
          <Label className="font-bold text-sm">OCRファイルアップロード</Label>
          <Input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(initialForm).map(([key]) => (
            <div key={key}>
              <Label className="text-sm mb-1 block">{fieldLabels[key] || key}</Label>
              {selectOptions[key] ? (
                <select
                  name={key}
                  value={formData[key as keyof typeof formData] ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                >
                  <option value="">選択してください</option>
                  {selectOptions[key].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <Input
                  name={key}
                  type={key.includes('date') ? 'date' : 'text'}
                  value={formData[key as keyof typeof formData] ?? ''}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleAdd}>追加</Button>
        </div>
      </Card>
    </div>
  )
}
