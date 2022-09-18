import {
  forExamplePages,
  loadExampleFile,
  TEST_DPI,
} from "./helpers/example-file";

describe("drawPageAsPNG", () => {
  forExamplePages("should return a b64 encoded png file", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.drawPageAsPNG(doc, page, TEST_DPI)).toMatchSnapshot();
  });
});
