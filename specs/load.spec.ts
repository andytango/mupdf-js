import { createMuPdf } from "../dist";
import { getExampleFile } from "./helpers/example-file";
import {getInvalidFile} from "./helpers/invalid-file";

describe("load", () => {
  it("should load a file from a node buffer object", async () => {
    const mupdf = await createMuPdf();
    const doc = await mupdf.load(getExampleFile());

    expect(doc).toBeDefined();
  });

  it("should have a title", async () => {
    const mupdf = await createMuPdf();
    const doc = await mupdf.load(getExampleFile());

    expect(mupdf.documentTitle(doc)).toMatchInlineSnapshot(`"Test Document"`);
  });

  it('should throw on invalid file', async () => {
    const mupdf = await createMuPdf();
    mupdf.setLogger({
      log: undefined,
      errorLog: undefined
    })
    expect(() => mupdf.load(getInvalidFile())).toThrow();
  });
});
