// File: /app/api/export-confirmation/route.ts

import { NextRequest } from 'next/server'
import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || 'test'

  const filePath = path.join(process.cwd(), 'templates', 'confirmation_template.xlsx')
  console.info('📂 テンプレートパス:', filePath)

  if (!fs.existsSync(filePath)) {
    console.error('❌ テンプレートファイルが見つかりません')
    return new Response('テンプレートファイルが見つかりません', { status: 500 })
  }

  const workbook = new ExcelJS.Workbook()

  try {
    await workbook.xlsx.readFile(filePath)
    console.info('✅ テンプレート読み込み成功')
  } catch (error) {
    console.error('❌ Excel読み込みエラー:', error)
    return new Response('Excel読み込みエラー', { status: 500 })
  }

  const sheet = workbook.getWorksheet(1)
  if (!sheet) {
    return new Response('シートが見つかりません', { status: 500 })
  }

  // ダミーデータの差し込み（テスト用）
  sheet.getCell('E5').value = 'テストホール'
  sheet.getCell('E10').value = 'PA-BKY01'
  sheet.getCell('Y14').value = new Date().toLocaleDateString('ja-JP')

  try {
    const buffer = await workbook.xlsx.writeBuffer()
    const uint8Array = new Uint8Array(buffer) // ここが重要

    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=confirmation_${id}.xlsx`,
      },
    })
  } catch (error) {
    console.error('❌ バッファ書き込みエラー:', error)
    return new Response('Excel出力エラー', { status: 500 })
  }
}