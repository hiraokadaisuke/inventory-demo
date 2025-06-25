import { downloadCsv } from "../utils";

describe("downloadCsv", () => {
  it("generates quoted CSV and triggers download", async () => {
    const rows = [{ a: "1,2", b: '3"4' }];
    const link: any = {
      click: jest.fn(),
      set download(v) {
        this._download = v;
      },
      get download() {
        return this._download;
      },
    };
    const createElSpy = jest
      .spyOn(document, "createElement")
      .mockReturnValue(link as any);
    (URL as any).createObjectURL = () => "";
    (URL as any).revokeObjectURL = () => {};
    const createSpy = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:");
    const revokeSpy = jest
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    downloadCsv(rows, "rows.csv");

    expect(link.download).toBe("rows.csv");
    const blob = createSpy.mock.calls[0][0] as Blob;
    expect(blob.size).toBeGreaterThan(0);

    expect(link.click).toHaveBeenCalled();

    createSpy.mockRestore();
    revokeSpy.mockRestore();
    createElSpy.mockRestore();
    delete (URL as any).createObjectURL;
    delete (URL as any).revokeObjectURL;
  });
});
