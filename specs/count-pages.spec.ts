import { loadExampleFile } from "./helpers/example-file";

describe("countPages", () => {
  it("should count pages", async () => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.countPages(doc)).toMatchInlineSnapshot(`4`);
  });
});
