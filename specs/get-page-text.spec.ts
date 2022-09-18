import { forExamplePages, loadExampleFile } from "./helpers/example-file";

describe("getPageText", () => {
  forExamplePages("should get the page text", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.getPageText(doc, page)).toMatchSnapshot();
  });
});
