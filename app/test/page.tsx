'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: any } | null>(null)

  const sampleData = [
    { id: 1, name: 'P北斗無双', maker: 'サミー' },
    { id: 2, name: 'Sバジリスク', maker: 'ユニバーサル' },
  ]

  const handleContextMenu = (e: React.MouseEvent, row: any) => {
    e.preventDefault()
    console.log('右クリック検知:', row)
    if (window.innerWidth >= 640) {
      setContextMenu({ x: e.clientX, y: e.clientY, row })
    }
  }

  useEffect(() => {
    const close = () => setContextMenu(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <div className="p-8">
      <table className="border w-full">
        <thead>
          <tr>
            <th className="border p-2">機種名</th>
            <th className="border p-2">メーカー</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row) => (
            <tr
              key={row.id}
              onContextMenu={(e) => handleContextMenu(e, row)}
              className="border hover:bg-gray-100 select-none"
            >
              <td className="border p-2">{row.name}</td>
              <td className="border p-2">{row.maker}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {contextMenu && (
        <ul
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'white',
            border: '1px solid #ccc',
            padding: '8px',
            zIndex: 9999,
            listStyle: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          <li style={{ padding: '4px 12px', cursor: 'pointer' }}>📄 確認書を作成</li>
        </ul>
      )}
    </div>
  )
}
