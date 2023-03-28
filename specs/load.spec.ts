import { createMuPdf } from "../dist";
import { getExampleFile } from "./helpers/example-file";

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
});
