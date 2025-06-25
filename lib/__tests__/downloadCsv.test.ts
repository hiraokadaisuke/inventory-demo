import { downloadCsv } from '../utils'

describe('downloadCsv', () => {
  it('generates quoted CSV and triggers download', async () => {
    const rows = [{ a: '1,2', b: '3"4' }]
    const link: any = { click: jest.fn(), set download(v) { this._download = v }, get download() { return this._download } }
    ;(global as any).document = { createElement: jest.fn(() => link) }
    const createSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:')
    const revokeSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    downloadCsv(rows, 'rows.csv')

    expect(link.download).toBe('rows.csv')
    const blob = createSpy.mock.calls[0][0] as Blob
    const text = await blob.text()
    expect(text).toBe('a,b\r\n"1,2","3""4"')

    expect(link.click).toHaveBeenCalled()

    createSpy.mockRestore()
    revokeSpy.mockRestore()
  })
})
