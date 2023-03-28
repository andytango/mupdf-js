import { forExamplePages, loadExampleFile } from "./helpers/example-file";

describe("drawPageAsSVG", () => {
  forExamplePages("should return an svg string", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.drawPageAsSVG(doc, page)).toMatchSnapshot();
  });
});
