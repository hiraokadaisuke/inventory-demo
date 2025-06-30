'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { differenceInDays, parseISO } from 'date-fns'
import { addYears, format } from 'date-fns';


type FormKey = keyof typeof initialForm

const initialForm = {
  installation: '', type: '', maker: '', machine_name: '', frame_color: '',
  board_serial: '', frame_serial: '', main_board_serial: '', installation_date: '',
  certificate_date: '', certificate_expiry: '', approval_date: '', approval_expiry: '',
  removal_date: '', elapsed_years: '', usage_count: '',
  purchase_source: '', purchase_total_price_tax_ex: '', purchase_total_price_tax_in: '',
  sell_date: '', buyer: '', sell_total_price_tax_ex: '', sell_total_price_tax_in: '',
  status: '', note: '', pdf_url: '', warehouse_id: '', 
  excluded_company: '', excluded_store: '', stock_in_date: '', read_date: '',
  read_staff: '', storage_fee_calc: '', glass_cylinder: '',
  sale_price: '', nail_sheet: '', condition: ''
}

const fieldLabels: { [key in FormKey]?: string } = {
  installation: '外れ店',
  type: '種別',
  maker: 'メーカー',
  machine_name: '機種',
  frame_color: '枠色・パネル',
  board_serial: '遊技盤番号等',
  frame_serial: '枠番号',
  main_board_serial: '主基板番号等',
  installation_date: '設置日',
  certificate_date: '検定日',
  certificate_expiry: '検定期日',
  approval_date: '認定日',
  approval_expiry: '認定期日',
  removal_date: '撤去日',
  elapsed_years: '設置期間',
  usage_count: '使用次',
  purchase_source: '購入元',
  purchase_total_price_tax_ex: '購入金額(税抜)',
  purchase_total_price_tax_in: '購入金額(税込)',
  sell_date: '売却日',
  buyer: '売却先',
  sell_total_price_tax_ex: '売却金額(税抜)',
  sell_total_price_tax_in: '売却金額(税込)',
  status: '状況',
  note: '備考',
  warehouse_id: '倉庫',
  excluded_company: '外れ法人',
  excluded_store: '外れ店',
  stock_in_date: '入庫日',
  read_date: '読取日',
  read_staff: '読取担当者',
  storage_fee_calc: '保管料計算',
  glass_cylinder: 'ガラス・シリンダー',
  sale_price: '販売価格',
  nail_sheet: '釘シート',
  condition: '状態'
}

const selectOptions: { [key in FormKey]?: string[] } = {
  installation: ['倉庫', '設置'],
  type: ['本体', '枠', 'セル'],
  nail_sheet: ['あり', 'なし'],
  condition: ['美品', '可', '不良'],
  storage_fee_calc: ['あり', 'なし'],
  glass_cylinder: ['あり', 'なし'],
  status: ['設置', '倉庫', '売却'],
}

const groupedFields: { [category: string]: FormKey[] } = {
  共通項目: [
    'status', 'type', 'maker', 'machine_name', 'frame_color',
    'board_serial', 'frame_serial', 'main_board_serial',
    'removal_date', 'usage_count', 'warehouse_id', 'note'
  ],
  ホール用項目: [
    'installation_date', 'elapsed_years',
    'certificate_date', 'certificate_expiry',
    'approval_date', 'approval_expiry',
    'purchase_source',
    'purchase_total_price_tax_ex', 'purchase_total_price_tax_in',
    'sell_date', 'buyer',
    'sell_total_price_tax_ex', 'sell_total_price_tax_in'
  ],
  倉庫用項目: [
    'excluded_company', 'excluded_store', 'stock_in_date',
    'read_date', 'read_staff', 'storage_fee_calc', 'glass_cylinder',
     
  ],
  パチマート項目: [
    'sale_price', 'nail_sheet', 'condition'
  ]
}

const customFieldType: { [key in FormKey]?: string } = {
  purchase_total_price_tax_ex: 'number',
  purchase_total_price_tax_in: 'number',
  sell_total_price_tax_ex: 'number',
  sell_total_price_tax_in: 'number',
  sale_price: 'number',
  removal_date: 'date',
  installation_date: 'date',
  certificate_date: 'date',
  certificate_expiry: 'date',
  approval_date: 'date',
  approval_expiry: 'date',
  sell_date: 'date',
  stock_in_date: 'date',
  read_date: 'date'
}

export default function InventoryInputOnly() {
  const router = useRouter()
  const [formData, setFormData] = useState<typeof initialForm>(initialForm)
  const [warehouses, setWarehouses] = useState<any[]>([])

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

    if (!formData.warehouse_id) {
      alert('倉庫を選択してください')
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
      router.push('/admin/inventory')
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
      setFormData(prev => ({ ...prev, ...result.inserted }))
      alert('OCRから自動入力しました')
    } else {
      alert('OCR失敗: ' + result.error)
    }
  }

  const renderField = (key: FormKey) => {
    const label = fieldLabels[key] || key
    const type = customFieldType[key] || 'text'

    const baseClass = 'border border-gray-300 rounded px-2 py-0.5 h-8 text-sm w-full'
    const wrapperClass = 'flex items-center gap-1 mb-0.5 border-b border-gray-100 pb-0.5'

    if (key === 'elapsed_years') {
      const installDate = formData.installation_date ? parseISO(formData.installation_date) : null
      const removalDate = formData.removal_date ? parseISO(formData.removal_date) : null
      let days = ''

      if (installDate) {
        const endDate = removalDate ?? new Date()
        const diff = differenceInDays(endDate, installDate)
        days = `${diff}日`
      }

      return (
        <div key={key} className={wrapperClass}>
          <Label className="w-32 text-sm text-gray-600 shrink-0">{label}</Label>
          <div className="text-sm">{days || '―'}</div>
        </div>
      )
    }

if (key === 'certificate_expiry' && formData.certificate_date) {
  const expiry = format(addYears(new Date(formData.certificate_date), 3), 'yyyy/MM/dd')
  return (
    <div key={key} className={wrapperClass}>
      <Label className="w-32 text-sm text-gray-600 shrink-0">{label}</Label>
      <Input value={expiry} readOnly className="h-8 text-sm flex-1 bg-gray-100 cursor-not-allowed" />
    </div>
  )
}

if (key === 'purchase_total_price_tax_in') {
  const taxEx = parseFloat(formData.purchase_total_price_tax_ex || '0')
  const taxIn = taxEx ? (taxEx * 1.1).toFixed(0) : ''
  return (
    <div key={key} className={wrapperClass}>
      <Label className="w-32 text-sm text-gray-600 shrink-0">{label}</Label>
      <Input value={taxIn} readOnly className="h-8 text-sm flex-1 bg-gray-100 cursor-not-allowed" />
    </div>
  )
}

if (key === 'sell_total_price_tax_in') {
  const taxEx = parseFloat(formData.sell_total_price_tax_ex || '0')
  const taxIn = taxEx ? (taxEx * 1.1).toFixed(0) : ''
  return (
    <div key={key} className={wrapperClass}>
      <Label className="w-32 text-sm text-gray-600 shrink-0">{label}</Label>
      <Input value={taxIn} readOnly className="h-8 text-sm flex-1 bg-gray-100 cursor-not-allowed" />
    </div>
  )
}


if (key === 'approval_expiry') {
  const expiry = formData.approval_date
    ? format(addYears(new Date(formData.approval_date), 3), 'yyyy/MM/dd')
    : ''
  return (
    <div key={key} className={wrapperClass}>
      <Label className="w-32 text-sm text-gray-600 shrink-0">{label}</Label>
      <Input value={expiry} readOnly className="h-8 text-sm flex-1 bg-gray-100 cursor-not-allowed" />
    </div>
  )
}



    if (key === 'warehouse_id') {
      return (
        <div key={key} className={wrapperClass}>
          <Label className="w-28 text-sm text-gray-600 shrink-0">{label}</Label>
          <select name={key} value={formData[key]} onChange={handleChange} className={baseClass}>
            <option value="">選択してください</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      )
    }

    if (selectOptions[key]) {
      return (
        <div key={key} className={wrapperClass}>
          <Label className="w-32 text-sm text-gray-600 shrink-0">{label}</Label>
          <select name={key} value={formData[key]} onChange={handleChange} className={baseClass}>
            <option value="">選択してください</option>
            {selectOptions[key]?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )
    }

    return (
      <div key={key} className={wrapperClass}>
        <Label className="w-32 text-sm text-gray-600 shrink-0">{label}</Label>
        <Input name={key} type={type} value={formData[key] ?? ''} onChange={handleChange} className="h-8 text-sm flex-1" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full mx-auto overflow-x-auto">
      <Card className="p-2">
<div className="flex justify-between items-center mb-0.5">
          <h1 className="text-lg font-bold">個別登録</h1>
          <div>
            <Label htmlFor="ocr-upload" className="sr-only">OCRアップロード</Label>
            <Input
              id="ocr-upload"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="ocr-upload">
              <Button type="button" className="text-white bg-blue-900 hover:bg-blue-800 text-sm px-3 h-8">
                OCRファイル選択
              </Button>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category} className="bg-white border rounded p-3">
              <h2 className="text-base font-semibold mb-2 border-b pb-1">{category}</h2>
              <div className="space-y-1">
                {fields.map(key => renderField(key))}
              </div>
            </div>
          ))}
        </div>

{/* 固定ボタン */}
<div className="fixed bottom-4 right-4 z-50">
  <Button
    onClick={handleAdd}
    className="bg-blue-900 hover:bg-blue-800 text-white text-sm px-6 py-2 h-10 shadow-lg"
  >
    追加
  </Button>
</div>

       
      </Card>
    </div>

    
  )
}
