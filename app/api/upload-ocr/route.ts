// app/api/upload-ocr/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import vision from '@google-cloud/vision'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ success: false, error: 'ファイルがありません' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const client = new vision.ImageAnnotatorClient({
      keyFilename: 'gcp-vision-key.json',
    })

    const [result] = await client.textDetection({ image: { content: buffer } })
    const text = result.textAnnotations?.[0]?.description || ''
    console.log('📄 OCR結果全文:', text)

    // シリアル番号抽出用の共通正規表現（メーカー記号に柔軟対応）
    const serialRegex = /[A-Z]{2,4}-[A-Z]?\s*\d{5,6}/g
    const allSerials = text.match(serialRegex) || []

    // 各項目抽出
    const machine_name = text.match(/型\s*式\s*名[:：]?\s*(.+)/)?.[1]?.trim() || ''
    const maker_raw = text.match(/製造業者名[:：]?\s*(.+)/)?.[1]?.trim() || ''
    const maker = maker_raw.replace(/^株式会社\s*/, '').trim()

    const board_serial = text.match(/遊技盤番号等[:：]?\s*([A-Z]{2,4}-[A-Z]?\s*\d{5,6})/)?.[1]?.trim()
                      || allSerials[0]?.trim() || ''
    const frame_serial = text.match(/枠番号[:：]?\s*([A-Z]{2,4}-[A-Z]?\s*\d{5,6})/)?.[1]?.trim()
                      || text.match(/枠\s*番\s*号[:：]?\s*([A-Z]{2,4}-[A-Z]?\s*\d{5,6})/)?.[1]?.trim()
                      || allSerials[1]?.trim() || ''
    const main_board_serial = text.match(/主基板番号等[:：]?\s*([A-Z]{2,4}-[A-Z]?\s*\d{5,6})/)?.[1]?.trim()
                          || allSerials[2]?.trim() || ''

    const certificate_date_raw = text.match(/令和\s*(\d+)年\s*(\d{1,2})月\s*(\d{1,2})日/)
    const certificate_date = certificate_date_raw
      ? dayjs()
          .locale('ja')
          .year(2018 + parseInt(certificate_date_raw[1], 10))
          .month(parseInt(certificate_date_raw[2], 10) - 1)
          .date(parseInt(certificate_date_raw[3], 10))
          .format('YYYY-MM-DD')
      : ''

    return NextResponse.json({
      success: true,
      inserted: {
        machine_name,
        maker,
        board_serial,
        frame_serial,
        main_board_serial,
        certificate_date,
        note: 'OCR自動入力',
      },
    })
  } catch (error: any) {
    console.error('❌ OCR処理中にエラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'OCR処理中に不明なエラーが発生しました',
      },
      { status: 500 }
    )
  }
}
