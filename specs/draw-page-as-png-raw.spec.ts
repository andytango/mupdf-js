import {
  forExamplePages,
  loadExampleFile,
  TEST_DPI,
} from "./helpers/example-file";
import {hash} from "./helpers/hash";

describe("drawPageAsPNGRaw", () => {
  forExamplePages("should return a png file as Uint8Array", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(hash(Buffer.from(mupdf.drawPageAsPNGRaw(doc, page, TEST_DPI)))).toMatchSnapshot();
  });
});
