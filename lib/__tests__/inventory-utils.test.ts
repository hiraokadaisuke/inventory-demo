import { rowsToCsv, formatDateJP } from '../utils'

describe('rowsToCsv', () => {
  it('converts rows to CSV string', () => {
    const rows = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ]
    const csv = rowsToCsv(rows)
    expect(csv).toBe('a,b\r\n1,2\r\n3,4')
  })
})

describe('formatDateJP', () => {
  it('formats valid date strings', () => {
    expect(formatDateJP('2025-06-25')).toBe('2025/6/25')
  })

  it('returns hyphen for undefined dates', () => {
    expect(formatDateJP()).toBe('-')
  })

  it('returns original value for invalid dates', () => {
    expect(formatDateJP('not-a-date')).toBe('not-a-date')
  })
})
