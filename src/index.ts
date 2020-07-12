import initMuPdf from "./libmupdf";
import type { MuPdf } from "./libmupdf";
export type { MuPdf } from "./libmupdf";

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
