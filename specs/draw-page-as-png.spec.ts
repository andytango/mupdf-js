import {
  forExamplePages,
  loadExampleFile,
  TEST_DPI,
} from "./helpers/example-file";
import {hash} from "./helpers/hash";

describe("drawPageAsPNG", () => {
  forExamplePages("should return a b64 encoded png file", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(hash(Buffer.from(mupdf.drawPageAsPNG(doc, page, TEST_DPI)))).toMatchSnapshot();
  });
});
