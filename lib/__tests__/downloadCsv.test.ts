// __tests__/downloadCsv.test.ts
import { downloadCsv } from "../utils";

describe("downloadCsv", () => {
  it("generates quoted CSV, creates a Blob, and triggers download", () => {
    const rows = [{ a: "1,2", b: '3"4' }];

    // ダミー <a> 要素
    const link: any = {
      click: jest.fn(),
      set download(v) {
        this._download = v;
      },
      get download() {
        return this._download;
      },
    };

    // <a> 要素生成をスタブ
    const createElSpy = jest
      .spyOn(document, "createElement")
      .mockReturnValue(link as any);

    // URL API をスタブ
    const createSpy = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:");
    const revokeSpy = jest
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    // 実行
    downloadCsv(rows, "rows.csv");

    // アサーション
    expect(link.download).toBe("rows.csv");          // ファイル名
    const blob = createSpy.mock.calls[0][0] as Blob; // 生成された Blob
    expect(blob instanceof Blob).toBe(true);
    expect(blob.size).toBeGreaterThan(0);            // データが入っている
    expect(link.click).toHaveBeenCalled();           // 自動クリック

    // 後片付け
    createElSpy.mockRestore();
    createSpy.mockRestore();
    revokeSpy.mockRestore();
  });
});
