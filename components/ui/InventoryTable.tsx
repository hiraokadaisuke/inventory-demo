"use client";
// components/InventoryTable.tsx
import { useState, useRef, useEffect } from 'react'

export type ColumnDef<T> = {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

export default function InventoryTable<T>({
  data,
  columns,
  onEdit,
}: {
  data: T[]
  columns: ColumnDef<T>[]
  onEdit?: (row: T) => void
}) {
  const [contextMenu, setContextMenu] = useState<
    { x: number; y: number; row: T } | null
  >(null)
  const tableRef = useRef<HTMLTableElement>(null)

  // 外をクリックしたらメニューを閉じる
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleContextMenu = (e: React.MouseEvent, row: any) => {
    e.preventDefault()
    if (window.innerWidth >= 640) {
      setContextMenu({ x: e.clientX, y: e.clientY, row })
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <table ref={tableRef} className="w-full">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-2 py-1 text-left">
                {c.label}
              </th>
            ))}
            {onEdit && <th className="px-2 py-1" />}
          </tr>
        </thead>
        <tbody>
          {data.map((row: T) => (
            <tr
              key={(row as any).id}
              onContextMenu={(e) => handleContextMenu(e, row)}
              className="select-none hover:bg-gray-50"
            >
              {columns.map((c) => (
                <td key={c.key} className="border px-2 py-1">
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
              {onEdit && (
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => onEdit(row)}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {contextMenu && (
        <ul
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: '5px',
            margin: 0,
            zIndex: 1000,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          <li
            style={{ padding: '6px 12px', cursor: 'pointer' }}
              onClick={() => {
                setContextMenu(null)
                console.info('📄 中古遊技機確認書を作成：', contextMenu.row)
                // ★ここでAPI呼び出し処理を後で実装
              }}
          >
            📄 中古遊技機確認書を作成
          </li>
          <li
            style={{ padding: '6px 12px', cursor: 'pointer' }}
              onClick={() => {
                setContextMenu(null)
                console.info('🧾 検定通知書を表示：', contextMenu.row)
                // ★ここでPDF表示処理を後で実装
              }}
          >
            🧾 検定通知書の表示
          </li>
        </ul>
      )}
    </div>
  )
}
