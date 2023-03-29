import { forExamplePages, loadExampleFile } from "./helpers/example-file";

describe("searchPageText", () => {
  forExamplePages("should search the page text", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.searchPageText(doc, page, "Lorem", 10)).toMatchSnapshot();
  });
});
