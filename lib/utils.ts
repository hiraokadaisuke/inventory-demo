import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Papa from 'papaparse'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function rowsToCsv(rows: Record<string, any>[]): string {
  return Papa.unparse(rows)
}

export function downloadCsv(rows: Record<string, any>[], filename: string): void {
  const csv = rowsToCsv(rows)
  if (typeof document === 'undefined') return
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function formatDateJP(date?: string | Date): string {
  if (!date) return '-'
  const dt = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dt.getTime())) return String(date)
  return dt.toLocaleDateString('ja-JP')
}
