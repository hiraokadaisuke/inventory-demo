'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Column = { key: string; label: string }
type ColumnGroup = { label: string; color: string; items: Column[] }

interface Props {
  columns: Column[]
  selected: string[]
  onChange: (next: string[]) => void
}

// ✅ カテゴリ定義（省略可・必要に応じて拡張）
const COLUMN_GROUPS: ColumnGroup[] = [
  {
    label: '共通項目',
    color: 'orange',
    items: [
      { key: 'status', label: '状況(設置・倉庫・売却)' },
      { key: 'type', label: '種別' },
      { key: 'maker', label: 'メーカー' },
      { key: 'machine_name', label: '機種' },
      { key: 'frame_color', label: '枠色・パネル' },
      { key: 'board_serial', label: '遊技盤番号等' },
      { key: 'frame_serial', label: '枠番号' },
      { key: 'main_board_serial', label: '主基板番号等' },
      { key: 'removal_date', label: '撤去日' },
      { key: 'usage_count', label: '使用次' },
      { key: 'warehouse_id', label: '倉庫' },
      { key: 'note', label: '備考' }
    ]
  },
  {
    label: 'ホール用',
    color: 'green',
    items: [
      { key: 'installation_date', label: '設置日' },
      { key: 'installation_period', label: '設置期間' },
      { key: 'certificate_date', label: '検定日' },
      { key: 'certificate_expiry', label: '検定期日' },
      { key: 'approval_date', label: '認定日' },
      { key: 'approval_expiry', label: '認定期日' },
      { key: 'purchase_source', label: '購入元' },
      { key: 'purchase_total_price_tax_ex', label: '購入金額(税抜)' },
      { key: 'purchase_total_price_tax_in', label: '購入金額(税込)' },
      { key: 'sell_date', label: '売却日' },
      { key: 'buyer', label: '売却先' },
      { key: 'sell_total_price_tax_ex', label: '売却金額(税抜)' },
      { key: 'sell_total_price_tax_in', label: '売却金額(税込)' }
    ]
  },
  {
    label: '倉庫用',
    color: 'gray',
    items: [
      { key: 'excluded_company', label: '外れ法人' },
      { key: 'excluded_store', label: '外れ店' },
      { key: 'stock_in_date', label: '入庫日' },
      { key: 'read_date', label: '読取日' },
      { key: 'read_staff', label: '読取担当者' },
      { key: 'storage_fee_calc', label: '保管料計算' },
      { key: 'glass_cylinder', label: 'ガラス・シリンダー' }
    ]
  },
  {
    label: 'パチマート関連',
    color: 'blue',
    items: [
      { key: 'sale_price', label: '販売価格' },
      { key: 'nail_sheet', label: '釘シート' },
      { key: 'condition', label: '状態' }
    ]
  }
]

const getPresetKeys = (label: string) =>
  COLUMN_GROUPS.find(g => g.label === label)?.items.map(i => i.key) || []

const ALL_KEYS = COLUMN_GROUPS.flatMap(g => g.items.map(i => i.key))
const STORAGE_KEY = 'visible_columns'
const ORDER_KEY = 'visible_order'

function SortableItem({ col, isChecked, onToggle }: {
  col: Column
  isChecked: boolean
  onToggle: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: col.key })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <label
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center gap-2 border px-2 py-1 rounded bg-white hover:bg-gray-100 cursor-move"
    >
      <input type="checkbox" checked={isChecked} onChange={onToggle} />
      <span className="text-sm">{col.label}</span>
    </label>
  )
}

export default function ColumnSettingsDialog({ columns, selected, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState<string[]>(ALL_KEYS)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedOrder = localStorage.getItem(ORDER_KEY)
    if (saved && savedOrder) {
      try {
        const visible = JSON.parse(saved)
        const orderList = JSON.parse(savedOrder)
        if (Array.isArray(visible)) onChange(visible)
        if (Array.isArray(orderList)) setOrder(orderList)
      } catch (e) {
        console.warn('設定の読み込みに失敗しました')
      }
    }
  }, [])

  const handleChange = (next: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    onChange(next)
  }

  const toggle = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key]
    handleChange(next)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = order.indexOf(active.id)
    const newIndex = order.indexOf(over.id)
    const newOrder = arrayMove(order, oldIndex, newIndex)
    setOrder(newOrder)
    localStorage.setItem(ORDER_KEY, JSON.stringify(newOrder))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#191970] text-white hover:bg-[#15155d]">
          表示項目設定
        </Button>
      </DialogTrigger>

      <DialogContent className="w-screen max-w-none max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>表示する項目を選択（ドラッグで並び替え可）</DialogTitle>
        </DialogHeader>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={order} strategy={verticalListSortingStrategy}>
    <div className="flex gap-6 flex-wrap">

      {COLUMN_GROUPS.map(group => (
        <div key={group.label} className="border rounded-md p-3 bg-white">
          <h2 className="text-sm font-semibold border-b pb-1 mb-2">{group.label}</h2>
          <div className="flex flex-col gap-2">
            {group.items.map(col => (
              <SortableItem
                key={col.key}
                col={col}
                isChecked={selected.includes(col.key)}
                onToggle={() => toggle(col.key)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </SortableContext>
</DndContext>


        <DialogFooter className="flex flex-col gap-4 mt-6">
          <div className="flex flex-wrap gap-2 justify-start">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                handleChange([...getPresetKeys('共通項目'), ...getPresetKeys('ホール用')])
              }
            >
              ホール用プリセット
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                handleChange([...getPresetKeys('共通項目'), ...getPresetKeys('倉庫用')])
              }
            >
              倉庫用プリセット
            </Button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => handleChange(ALL_KEYS)}>全選択</Button>
            <Button variant="outline" size="sm" onClick={() => handleChange([])}>全解除</Button>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>閉じる</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
