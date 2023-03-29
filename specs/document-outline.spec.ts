import { loadExampleFile } from "./helpers/example-file";

describe("documentOutline", () => {
  it("should return the document outline", async () => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.documentOutline(doc)).toMatchInlineSnapshot(`null`);
  });
});
