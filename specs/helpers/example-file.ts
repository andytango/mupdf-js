import { readFileSync } from "fs";
import { createMuPdf } from "../../dist";

export const TEST_DPI = 72;

export async function loadExampleFile() {
  const mupdf = await createMuPdf();
  const doc = mupdf.load(getExampleFile());
  return { mupdf, doc };
}

let exampleFile = null as null | Buffer;

export function getExampleFile() {
  if (!exampleFile) {
    exampleFile = readFileSync("./examples/example.pdf");
  }

  return exampleFile;
}

export function forExamplePages(
  msg: string,
  fn: (page: number) => void | Promise<void>
) {
  [1, 2, 3, 4].forEach((page) => {
    it(`Page [${page} / 4] - ${msg}`, async () => fn(page));
  });
}
