// /app/(admin)/inventory/csv-import.tsx
'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CsvImport() {
  const [csvFile, setCsvFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setCsvFile(file)
  }

  const handleImport = () => {
    if (!csvFile) return alert('CSVファイルを選択してください')

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as Record<string, string>[]

        const cleaned = data.map(row =>
          Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k, v === '' ? null : v])
          )
        )

        const { error } = await supabase.from('inventory').insert(cleaned)
        if (error) {
          console.error(error)
          alert('インポートに失敗しました')
        } else {
          alert('インポート完了')
        }
      },
      error: (err) => {
        console.error(err)
        alert('CSV読み込み失敗')
      }
    })
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">CSVインポート</h2>
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      <Button onClick={handleImport}>インポート</Button>
    </div>
  )
}
