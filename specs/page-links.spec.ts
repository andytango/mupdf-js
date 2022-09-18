import {
  forExamplePages,
  loadExampleFile,
  TEST_DPI,
} from "./helpers/example-file";

describe("pageLinks", () => {
  forExamplePages("should get the page links", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.pageLinks(doc, page, TEST_DPI)).toMatchSnapshot();
  });
});
