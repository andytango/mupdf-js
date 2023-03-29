import { forExamplePages, loadExampleFile } from "./helpers/example-file";

describe("drawPageAsHTML", () => {
  forExamplePages("should return a html string", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.drawPageAsHTML(doc, page)).toMatchSnapshot();
  });
});
