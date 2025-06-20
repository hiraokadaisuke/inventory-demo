'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  { key: 'pdf_url',              label: 'PDF' },
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

  /* ---------- CSV インポート (ハンドラ) ---------- */
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
  const handleDelete = async (id: number) => {
    if (!window.confirm('本当に削除しますか？')) return
    await supabase.from('inventory').delete().eq('id', id)
    fetchData()
  }
  const handleEdit = (i: any) => { setEditingId(i.id); setEditForm(i) }
  const handleSave = async () => {
    await supabase.from('inventory').update(editForm).eq('id', editingId)
    setEditingId(null)
    fetchData()
  }

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

{/* 🔸列選択 UI（復活） */}
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

<div className="flex justify-between items-center mb-1">
  <div className="text-sm text-[#191970] font-medium">対象件数：{entries.length}件</div>
</div>

        {/* データテーブル */}
        <div className="w-full overflow-auto">
          <table className="min-w-[1200px] text-sm border border-gray-300">
            <thead className="bg-gray-100 text-xs select-none">
              <tr>
                {columns.filter(c => selectedColumns.includes(c.key)).map(c => {
                  /* そのカラムの全値（文字列化し空白も） */
                  const values = [...new Set(allEntries.map(e =>
                    String(e[c.key] ?? '(空白セル)')))].sort()
                  const active = columnValueFilters[c.key]?.size
                  return (
                    <th
  key={c.key}
  className="relative px-2 py-1 border text-left cursor-pointer hover:bg-gray-100"
  onClick={(e) => {
    e.stopPropagation()
    const values = [...new Set(allEntries.map(e =>
      String(e[c.key] ?? '(空白セル)')))].sort()
    openFilterMenu(c.key, e.clientX, e.clientY, values)
  }}
>
  {c.label}
</th>
                  )
                })}
                <th className="px-2 py-1 border">操作</th>
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
                    <td key={c.key} className="px-2 py-1 border">
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
                  <td className="px-2 py-1 border whitespace-nowrap">
                    {editingId === row.id
                      ? <Button size="sm" onClick={handleSave} className="bg-[#191970] text-white">保存</Button>
                      : <Button size="sm" onClick={() => handleEdit(row)} className="bg-[#191970] text-white">編集</Button>}
                    <Button
                      size="sm"
                      onClick={() => handleDelete(row.id)}
                      className="bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded px-3 py-1 text-sm"
                    >
                      削除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 右クリックメニュー例 (内容は省略) */}
        {contextMenu && (
          <ul style={{
            position: 'fixed', top: contextMenu.y, left: contextMenu.x,
            background: '#fff', border: '1px solid #ccc', padding: 8, zIndex: 9999,
            boxShadow: '0 2px 6px rgba(0,0,0,.2)', listStyle: 'none'
          }}>
            <li className="cursor-pointer px-3 py-1"
                onClick={() => setContextMenu(null)}>アクション</li>
          </ul>
        )}

        {/* フィルターダイアログ */}
        {filterMenu && (() => {
          const key  = filterMenu.key
          const allVals = [...new Set(allEntries.map(e => String(e[key] ?? '(空白セル)')))].sort()
          const shown   = allVals.filter(v => v.includes(searchText))
          /* 選択状態に同期された tempChecked を使う */
          const toggle = (v: string) => {
            setTempChecked(prev => {
              const n = new Set(prev)
              n.has(v) ? n.delete(v) : n.add(v)
              return n
            })
          }
          const ok = () => {
            setColumnValueFilters(prev => ({ ...prev, [key]: new Set(tempChecked) }))
            setFilterMenu(null)
          }
          const clear = () => {
            setTempChecked(new Set(allVals))
          }
          return (
            <div
              style={{
                position: 'fixed', top: filterMenu.y, left: filterMenu.x,
                background: '#fff', border: '1px solid #ccc', zIndex: 9999,
                boxShadow: '0 2px 6px rgba(0,0,0,.2)', minWidth: 260, padding: 8
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* ソート */}
              <div className="text-sm cursor-pointer hover:bg-gray-100 px-2 py-[2px]"
                   onClick={() => { setSortColumn(key); setSortAsc(true); setFilterMenu(null) }}>▲ 昇順</div>
              <div className="text-sm cursor-pointer hover:bg-gray-100 px-2 py-[2px]"
                   onClick={() => { setSortColumn(key); setSortAsc(false); setFilterMenu(null) }}>▼ 降順</div>
              <hr className="my-1" />
              {/* 検索 */}
              <Input placeholder="検索" value={searchText}
                     onChange={e => setSearchText(e.target.value)} className="mb-1" />
              {/* チェックリスト */}
              <div className="max-h-40 overflow-auto border px-1 py-[2px] text-sm">
                <label className="flex items-center space-x-1">
                  <input type="checkbox"
                         checked={tempChecked.size === allVals.length}
                         onChange={() => tempChecked.size === allVals.length
                           ? setTempChecked(new Set())  /* none */
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
              {/* ボタン */}
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => setFilterMenu(null)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded px-3 py-1 text-sm"
                >
                  キャンセル
                </Button>
                <Button
                  size="sm"
                  onClick={clear}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded px-3 py-1 text-sm"
                >
                  クリア
                </Button>
                <Button
                  size="sm"
                  onClick={ok}
                  className="bg-[#191970] text-white hover:bg-[#15155d] rounded px-3 py-1 text-sm"
                >
                  OK
                </Button>
              </div>
            </div>
          )
        })()}
      </div>
    </>
  )
}
