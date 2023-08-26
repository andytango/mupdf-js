import { readFileSync } from "fs";
import { createMuPdf, MuPdf } from "../../dist";

const TOTAL_PAGES = 58;

type ExampleFileHandler = { mupdf: MuPdf.CommonContextInstance; doc: MuPdf.DocumentHandle };

export function loadExampleFileSingleton() {
  let instance = null as null | ExampleFileHandler;
  let isLoading = false;

  return async () => {
    if (!instance) {
      isLoading = true;
      instance = await loadExampleFile();
      isLoading = false;
      return instance;
    }

    if (isLoading) {
      throw new Error("File already being loaded");
    }

    return instance;
  };
}

export async function loadExampleFile(): Promise<ExampleFileHandler> {
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
    it(`Page [${page} / ${TOTAL_PAGES}] - ${msg}`, async () => fn(page));
  }
}
