import { createMuPdf } from "../dist";
import { getExampleFile } from "./helpers/example-file";

describe("freeDocument", () => {
  it("should free the document", async () => {
    const mupdf = await createMuPdf();
    const doc = await mupdf.load(getExampleFile());

    mupdf.freeDocument(doc);
    expect(mupdf.documentTitle(doc)).toMatchInlineSnapshot(`"Untitled"`);
  });
});
