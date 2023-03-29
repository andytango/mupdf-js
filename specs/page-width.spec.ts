import {
  forExamplePages,
  loadExampleFile,
  TEST_DPI,
} from "./helpers/example-file";

describe("pageWidth", () => {
  forExamplePages("should return the page width", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.pageWidth(doc, page, TEST_DPI)).toMatchSnapshot();
  });
});
