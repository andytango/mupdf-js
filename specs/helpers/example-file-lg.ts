import { readFileSync } from "fs";
import { createMuPdf } from "../../dist";

const TOTAL_PAGES = 58;

export async function loadExampleFile() {
  const mupdf = await createMuPdf();
  const doc = mupdf.load(getExampleFile());
  return { mupdf, doc };
}

let exampleFile = null as null | Buffer;

export function getExampleFile() {
  if (!exampleFile) {
    exampleFile = readFileSync("./examples/example-lg.pdf");
  }

  return exampleFile;
}

export function forExamplePages(
  msg: string,
  fn: (page: number) => void | Promise<void>
) {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    it(`Page [${page} / 4] - ${msg}`, async () => fn(page));
  }
}
