import type { MuPdf } from "./mupdf-wasm";
import initMuPdf from "./mupdf-wasm";

export type { MuPdf } from "./mupdf-wasm";

export async function createMuPdf() {
  const muPdf = await initMuPdf();
  return wrapMuPdf(muPdf);
}

export default createMuPdf;

function wrapMuPdf(muPdf: MuPdf.Module): MuPdf.Instance {
  const {
    FS: { writeFile },
    openDocument,
  } = muPdf;

  return {
    load(fileData: Buffer | ArrayBufferView, name = generateFileName()) {
      writeFile(name, fileData);
      return openDocument(name);
    },
    ...muPdf,
  };
}

let i = 0;

function generateFileName() {
  return `tmp_${i++}.pdf`;
}
