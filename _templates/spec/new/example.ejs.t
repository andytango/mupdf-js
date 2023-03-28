---
to: specs/<%= h.changeCase.paramCase(name) %>.spec.ts
---
import {
  forExamplePages,
  loadExampleFile,
  TEST_DPI,
} from "./helpers/example-file";

describe("<%= name %>", () => {
  forExamplePages("should ...", async (page) => {
    const { mupdf, doc } = await loadExampleFile();
    expect(true).toMatchSnapshot();
  });
});