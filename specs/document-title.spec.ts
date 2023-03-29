import { loadExampleFile } from "./helpers/example-file";

describe("documentTitle", () => {
  it("should return the document title", async () => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.documentTitle(doc)).toMatchInlineSnapshot(`"Test Document"`);
  });
});
