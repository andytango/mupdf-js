import {
  forExamplePages,
  loadExampleFile,
  TEST_DPI,
} from "./helpers/example-file";

describe("pageHeight", () => {
  forExamplePages("should return the page height", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.pageHeight(doc, page, TEST_DPI)).toMatchSnapshot();
  });
});
