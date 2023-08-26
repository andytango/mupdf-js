import { forExamplePages, loadExampleFile } from "./helpers/example-file";
import {hash} from "./helpers/hash";

describe("drawPageAsSVG", () => {
  forExamplePages("should return an svg string", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(hash(Buffer.from(mupdf.drawPageAsSVG(doc, page)))).toMatchSnapshot();
  });
});
