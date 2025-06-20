// components/InventoryTable.tsx
import { useState, useRef, useEffect } from 'react'

export default function InventoryTable({ data }: { data: any[] }) {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, row: any } | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  // 外をクリックしたらメニューを閉じる
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleContextMenu = (e: React.MouseEvent, row: any) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, row })
  }

  return (
    <div style={{ position: 'relative' }}>
      <table ref={tableRef}>
        <thead>
          <tr>
            <th>機種名</th>
            <th>型式</th>
            <th>メーカー</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} onContextMenu={(e) => handleContextMenu(e, row)}>
              <td>{row.machine_name}</td>
              <td>{row.model}</td>
              <td>{row.maker}</td>
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
              console.log('📄 中古遊技機確認書を作成：', contextMenu.row)
              // ★ここでAPI呼び出し処理を後で実装
            }}
          >
            📄 中古遊技機確認書を作成
          </li>
          <li
            style={{ padding: '6px 12px', cursor: 'pointer' }}
            onClick={() => {
              setContextMenu(null)
              console.log('🧾 検定通知書を表示：', contextMenu.row)
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
