import {
  forExamplePages,
  loadExampleFileSingleton,
} from "./helpers/example-file-lg";

const loadExampleFile = loadExampleFileSingleton();

describe("getPageText with large file", () => {
  forExamplePages("should get the page text", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.getPageText(doc, page)).toMatchSnapshot();
  });
});
