'use client'

import { useState } from 'react'

type Props = {
  setFormData: (updater: (prev: any) => any) => void
}

export default function OCRUploader({ setFormData }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('ファイルを選んでください')
      return
    }

    setLoading(true)
    setMessage('アップロード中...')

    const formData = new FormData()
    formData.append('file', selectedFile)

    const res = await fetch('/api/upload-ocr', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()

    if (result.success && result.extracted) {
      setMessage('✅ 登録が完了しました！')

      const {
        maker,
        machine_name,
        inspection_date,
        board_serial,
        frame_serial,
        main_board,
        note
      } = result.extracted

      setFormData(prev => ({
        ...prev,
        maker,
        machine_name,
        inspection_date,
        board_serial,
        frame_serial,
        main_board_serial: main_board,
        note,
      }))
    } else {
      setMessage('❌ 登録失敗: ' + result.error)
    }

    setLoading(false)
  }

  return (
    <div className="p-4 border border-gray-300 rounded space-y-2 w-fit bg-white">
      <h3 className="font-bold">OCRから在庫登録</h3>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
      >
        {loading ? '処理中...' : 'OCRで登録'}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  )
}
