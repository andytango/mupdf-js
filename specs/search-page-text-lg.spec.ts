import {
  forExamplePages,
  loadExampleFileSingleton,
} from "./helpers/example-file-lg";

const loadExampleFile = loadExampleFileSingleton();

describe("searchPageText with a large file", () => {
  forExamplePages("should search the page text", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(mupdf.searchPageText(doc, page, "facebook", 10)).toMatchSnapshot();
  });
});
