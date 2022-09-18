import { createMuPdf } from "../dist";

describe("createMuPdf", () => {
  it("should create a MuPdf instance", async () => {
    const mupdf = await createMuPdf();
    expect(mupdf).toBeDefined();
    expect(Object.getOwnPropertyNames(mupdf)).toMatchSnapshot();
  });
});
