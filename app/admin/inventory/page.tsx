'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import EditModal from '@/components/EditModal'
import { Download, Upload, Pencil, Trash2 } from 'lucide-react'
import { Package } from 'lucide-react'




/* ---------------------------------------------
 * カラム定義
 * ------------------------------------------- */
const columns = [
  { key: 'installation',         label: '設置' },
  { key: 'type',                 label: '種別' },
  { key: 'maker',                label: 'メーカー' },
  { key: 'machine_name',         label: '機種名' },
  { key: 'frame_color',          label: '枠色' },
  { key: 'board_serial',         label: '遊技盤番号等' },
  { key: 'frame_serial',         label: '枠番号' },
  { key: 'main_board_serial',    label: '主基板番号等' },
  { key: 'installation_date',    label: '設置日' },
  { key: 'certificate_date',     label: '検定日' },
  { key: 'certificate_expiry',   label: '検定期日' },
  { key: 'approval_date',        label: '認定日' },
  { key: 'approval_expiry',      label: '認定期日' },
  { key: 'removal_date',         label: '撤去日' },
  { key: 'elapsed_years',        label: '経過年数' },
  { key: 'purchase_flag',        label: '購入' },
  { key: 'usage_count',          label: '使用次' },
  { key: 'purchase_unit_price',  label: '購入単価' },
  { key: 'purchase_total_price', label: '購入金額' },
  { key: 'sell_date',            label: '売却日' },
  { key: 'buyer',                label: '売却先' },
  { key: 'sell_unit_price',      label: '売却単価' },
  { key: 'sell_total_price',     label: '売却金額' },
  { key: 'status',               label: '状況' },
  { key: 'note',                 label: '備考' },
]

/* ---------------------------------------------
 * メイン
 * ------------------------------------------- */
export default function AdminInventoryPage() {
  /* ---------- 状態 ---------- */
  const [allEntries, setAllEntries]           = useState<any[]>([])
  const [entries, setEntries]                 = useState<any[]>([])
  const [editingId, setEditingId]             = useState<number | null>(null)
  const [editForm, setEditForm]               = useState<any>({})
  const [sortColumn, setSortColumn]           = useState<string | null>(null)
  const [sortAsc, setSortAsc]                 = useState(true)
  const [showFilters, setShowFilters]         = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(c => c.key))
  const [showModal, setShowModal] = useState(false)         // モーダルを開く状態
　const [editTarget, setEditTarget] = useState<any>()       // 編集したいデータ

  /* 右クリックメニュー */
  const [contextMenu, setContextMenu] =
    useState<{ x: number; y: number; row: any } | null>(null)


  /* ▼フィルターダイアログ */
  const [filterMenu, setFilterMenu] = useState<{
    key: string
    x: number
    y: number
  } | null>(null)

  /* そのカラムのチェック状態を一時保持 */
  const [tempChecked, setTempChecked] = useState<Set<string>>(new Set())
  const [searchText, setSearchText]   = useState('')
  const [columnValueFilters, setColumnValueFilters] =
    useState<Record<string, Set<string>>>({})

  /* 旧メーカー絞り込み (残してあるが不要なら削除OK) */
  const [makerFilter, setMakerFilter] = useState('')
  const makerOptions =
    [...new Set(allEntries.map(e => e.maker).filter(Boolean))].sort()

  /* ---------- データ取得 ---------- */
  const fetchData = async () => {
    let query: any = supabase.from('inventory').select('*')
    if (sortColumn) query = query.order(sortColumn, { ascending: sortAsc })
    const { data, error } = await query
    if (!error && data) setAllEntries(data)
  }
  useEffect(() => { fetchData() }, [sortColumn, sortAsc])

  const saveRow = async (data: any) => {
  if (data.id) {
    // idがある → 既存行 → 更新
    await supabase.from('inventory').update(data).eq('id', data.id)
  } else {
    // idがない → 新規登録（今回は編集だけなので通常使わない）
    await supabase.from('inventory').insert(data)
  }

  setShowModal(false)  // モーダルを閉じる
  fetchData()          // 表を再読み込み
}


  /* ---------- フィルター適用 ---------- */
  useEffect(() => {
    const filtered = allEntries
      .filter(e => !makerFilter || e.maker === makerFilter)
      .filter(e =>
        Object.entries(columnValueFilters).every(([k, set]) =>
          set.size === 0 ? true : set.has(String(e[k] ?? '(空白セル)')),
        ),
      )
    setEntries(filtered)
  }, [allEntries, makerFilter, columnValueFilters])

  /* ---------- CSV インポート ---------- */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const rows = text.trim().split('\n')
      const headers = rows[0].split(',')
      const data = rows.slice(1).map(row => {
        const values = row.split(',')
        return Object.fromEntries(headers.map((h, i) => [h, values[i] || null]))
      })

      const { error } = await supabase.from('inventory').insert(data)
      if (error) throw error
      alert('CSVインポート完了')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('CSVインポートに失敗しました')
    } finally {
      e.target.value = '' // 同じファイルの再選択を許可
    }
  }

  /* ---------- 行操作 ---------- */
  const handleDelete = async (row: any) => {
    if (!window.confirm('本当に削除しますか？')) return
    await supabase.from('inventory').delete().eq('id', row.id)
    fetchData()
  }
  const handleEditClick = (row: any) => {
  setEditTarget(row)
  setShowModal(true)
}

  const handleEdit     = (row: any) => { setEditingId(row.id); setEditForm(row) }
  const handleSave     = async () => {
    await supabase.from('inventory').update(editForm).eq('id', editingId)
    setEditingId(null)
    fetchData()
  }

  /* ---------- PDF 生成／出品（stub） ---------- */
  const exportKentei       = (row: any) => { /* TODO: 実装 */ console.log('検定通知書', row) }
  const exportConfirmation = (row: any) => { /* TODO: 実装 */ console.log('中古遊技機確認書', row) }
  const exportRemoval      = (row: any) => { /* TODO: 実装 */ console.log('撤去明細書', row) }
  const exportToPachimart  = (row: any) => { /* TODO: 実装 */ console.log('パチマート出品', row) }

  /* ---------- 列切り替え ---------- */
  const toggleColumn = (k: string) => {
    setSelectedColumns(p =>
      p.includes(k) ? p.filter(x => x !== k) : [...p, k],
    )
  }

  /* ---------- 日付表示 ---------- */
  const dateFmt = (d?: string) => {
    if (!d) return '-'
    const dt = new Date(d)
    return isNaN(dt.getTime())
      ? d
      : `${dt.getFullYear().toString().slice(-2)}/${dt.getMonth() + 1}/${dt.getDate()}`
  }

  /* ---------- 外クリックでメニュー全部閉じる ---------- */
  useEffect(() => {
    const close = () => { setContextMenu(null); setFilterMenu(null) }
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  /* ---------- テンポラリチェック初期化 ---------- */
  const openFilterMenu = (
    key: string,
    x: number,
    y: number,
    colValues: string[],
  ) => {
    setFilterMenu({ key, x, y })
    const applied = columnValueFilters[key] ?? new Set(colValues)
    setTempChecked(new Set(applied))
    setSearchText('')
  }

  /* ---------- UI ---------- */
  return (
    <>
      {/* フォント */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          :root { --pachimart-font: 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif; }
          body  { font-family: var(--pachimart-font); }
        `}</style>
      </Head>

      <div className="p-4">
        {/* 操作バー */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Button
            onClick={() => document.getElementById('csv-hidden-input')?.click()}
            className="bg-[#191970] text-white hover:bg-[#15155d]"
          >
            一括CSV登録
          </Button>

          <input
            id="csv-hidden-input"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={() => window.open('/admin/inventory/input', '_blank')}
            className="bg-[#191970] text-white hover:bg-[#15155d]"
          >
            個別登録
          </Button>

          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-[#191970] text-white hover:bg-[#15155d]"
          >
            項目を絞り込む
          </Button>

          <select
            value={makerFilter}
            onChange={e => setMakerFilter(e.target.value)}
            className="border px-3 py-[6px] h-[38px] rounded"
          >
            <option value="">メーカー指定なし</option>
            {makerOptions.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* 列選択 UI */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-4 p-3 border rounded bg-gray-50">
            {columns.map(c => (
              <label key={c.key} className="flex items-center gap-1 bg-white border rounded px-2 py-1">
                <input type="checkbox"
                       checked={selectedColumns.includes(c.key)}
                       onChange={() => toggleColumn(c.key)} />
                <span className="text-sm">{c.label}</span>
              </label>
            ))}
            <Button size="sm" onClick={() => setShowFilters(false)}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded px-3 py-1 text-sm">
              閉じる
            </Button>
          </div>
        )}

        {/* 件数 */}
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-[#191970] font-medium">対象件数：{entries?.length ?? 0}件</div>
        </div>

        {/* データテーブル */}
        <div className="w-full overflow-auto">
          <table className="min-w-[1200px] text-sm border border-gray-300">
            <thead className="bg-gray-100 text-xs select-none">
              <tr>
                {columns.filter(c => selectedColumns.includes(c.key)).map(c => {
                  const values = [...new Set(allEntries.map(e =>
                    String(e[c.key] ?? '(空白セル)')))].sort()
                  return (
                    <th
  key={c.key}
  className={`relative px-2 py-1 border text-left cursor-pointer hover:bg-gray-100 
              ${(c.key === 'installation' || c.key === 'type' || c.key === 'machine_name') ? '' : 'hidden sm:table-cell'}`}
  onClick={(e) => {
    e.stopPropagation()
    openFilterMenu(c.key, e.clientX, e.clientY, values)
  }}
>
  {c.label}
</th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {entries.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50"
                  onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, row }) }}
                >
                  {columns.filter(c => selectedColumns.includes(c.key)).map(c => (
                    <td
  key={c.key}
  className={`px-2 py-1 border 
              ${(c.key === 'installation' || c.key === 'type' || c.key === 'machine_name') ? '' : 'hidden sm:table-cell'}`}
>
  {editingId === row.id
    ? <Input
        value={editForm[c.key] ?? ''}
        onChange={e => setEditForm((p: any) => ({ ...p, [c.key]: e.target.value }))}
      />
    : c.key.includes('date') || c.key.includes('expiry')
      ? dateFmt(row[c.key])
      : String(row[c.key] ?? '-')}
</td>
                  ))}
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>


/* ---------- 右クリックメニュー ---------- */
{contextMenu && (
  <ul
    style={{
      position: 'fixed',
      top: contextMenu.y,
      left: contextMenu.x,
      background: '#fff',
      border: '1px solid #ddd',
      padding: 4,
      borderRadius: 4,
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,.15)',
      width: 220
    }}
    onContextMenu={(e) => e.preventDefault()}
  >
    {/* 共通の li コンポーネントでアイコン＋ラベル */}
    <MenuItem
      icon={<Download className="w-4 h-4" />}
      label="検定通知書の出力"
      onClick={() => { exportKentei(contextMenu.row); setContextMenu(null) }}
    />
    <MenuItem
      icon={<Download className="w-4 h-4" />}
      label="中古遊技機確認書の出力"
      onClick={() => { exportConfirmation(contextMenu.row); setContextMenu(null) }}
    />
    <MenuItem
      icon={<Download className="w-4 h-4" />}
      label="撤去明細書の出力"
      onClick={() => { exportRemoval(contextMenu.row); setContextMenu(null) }}
    />
    <MenuItem
  icon={<Package className="w-4 h-4" />}
  label="パチマートへ出品"
  onClick={() => {
    exportToPachimart(contextMenu.row)
    setContextMenu(null)
  }}
/>

    <hr className="my-1" />

    <MenuItem
      icon={<Pencil className="w-4 h-4" />}
      label="編集"
      onClick={() => { handleEditClick(contextMenu.row); setContextMenu(null) }}
    />
    <MenuItem
      icon={<Trash2 className="w-4 h-4 text-red-500" />}
      label="削除"
      onClick={() => { handleDelete(contextMenu.row); setContextMenu(null) }}
      className="text-red-600"
    />
  </ul>
)}


        {/* フィルターダイアログ（省略＝元のまま） */}
        {filterMenu && (() => {
          const key  = filterMenu.key
          const allVals = [...new Set(allEntries.map(e => String(e[key] ?? '(空白セル)')))].sort()
          const shown   = allVals.filter(v => v.includes(searchText))
          const toggle  = (v: string) => {
            setTempChecked(prev => {
              const n = new Set(prev)
              n.has(v) ? n.delete(v) : n.add(v)
              return n
            })
          }
          const ok    = () => {
            setColumnValueFilters(prev => ({ ...prev, [key]: new Set(tempChecked) }))
            setFilterMenu(null)
          }
          const clear = () => setTempChecked(new Set(allVals))

          return (
            <div
              style={{
                position: 'fixed', top: filterMenu.y, left: filterMenu.x,
                background: '#fff', border: '1px solid #ccc', zIndex: 9999,
                boxShadow: '0 2px 6px rgba(0,0,0,.2)', minWidth: 260, padding: 8
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-sm cursor-pointer hover:bg-gray-100 px-2 py-[2px]"
                   onClick={() => { setSortColumn(key); setSortAsc(true);  setFilterMenu(null) }}>▲ 昇順</div>
              <div className="text-sm cursor-pointer hover:bg-gray-100 px-2 py-[2px]"
                   onClick={() => { setSortColumn(key); setSortAsc(false); setFilterMenu(null) }}>▼ 降順</div>
              <hr className="my-1" />
              <Input placeholder="検索" value={searchText}
                     onChange={e => setSearchText(e.target.value)} className="mb-1" />
              <div className="max-h-40 overflow-auto border px-1 py-[2px] text-sm">
                <label className="flex items-center space-x-1">
                  <input type="checkbox"
                         checked={tempChecked.size === allVals.length}
                         onChange={() => tempChecked.size === allVals.length
                           ? setTempChecked(new Set())      // none
                           : setTempChecked(new Set(allVals))} />
                  <span>(すべて選択)</span>
                </label>
                {shown.map(v => (
                  <label key={v} className="flex items-center space-x-1 ml-1">
                    <input type="checkbox"
                           checked={tempChecked.has(v)}
                           onChange={() => toggle(v)} />
                    <span>{v}</span>
                  </label>
                ))}
                
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button size="sm" onClick={() => setFilterMenu(null)}
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded px-3 py-1 text-sm">
                  キャンセル
                </Button>
                <Button size="sm" onClick={clear}
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded px-3 py-1 text-sm">
                  クリア
                </Button>
                <Button size="sm" onClick={ok}
                        className="bg-[#191970] text-white hover:bg-[#15155d] rounded px-3 py-1 text-sm">
                  OK
                </Button>
              </div>
            </div>
          )
        })()}
        
      </div>
      {/* 編集モーダル */}
<EditModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSave={saveRow}
  data={editTarget}
/>

    </>
  )
}

/* ------------------------------------------------------------------
 * 共通メニュー項目コンポーネント
 * ---------------------------------------------------------------- */
function MenuItem({
  icon,
  label,
  onClick,
  className = ''
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <li
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer 
                  hover:bg-gray-100 text-sm whitespace-nowrap ${className}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </li>
  )
}