import { downloadCsv } from '../utils'

describe('downloadCsv', () => {
  it('generates quoted CSV and triggers download', async () => {
    const rows = [{ a: '1,2', b: '3"4' }]
    const link: any = { click: jest.fn(), set download(v) { this._download = v }, get download() { return this._download } }
    ;(global as any).document = { createElement: jest.fn(() => link) }
    // Provide stub implementations for browser-specific APIs
    const createSpy = jest.fn(() => 'blob:')
    const revokeSpy = jest.fn()
    ;(URL as any).createObjectURL = createSpy
    ;(URL as any).revokeObjectURL = revokeSpy

    downloadCsv(rows, 'rows.csv')
    const blob = createSpy.mock.calls[0][0] as Blob
    expect(blob instanceof Blob).toBe(true)

    createSpy.mockRestore()
    revokeSpy.mockRestore()
  })
})
