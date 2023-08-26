import type { MuPdf } from "./libmupdf";
import initMuPdf from "./libmupdf";

export type { MuPdf } from "./libmupdf";



export async function createMuPdf() {
  const muPdf = await initMuPdf();
  const ctx = muPdf.createContext();
  return wrapMuPdf(ctx, muPdf);
}

export async function createMuPdfWithoutContext() {
  const muPdf = await initMuPdf();
  return wrapMuPdfWithoutContext(muPdf);
}

export default createMuPdf;

function wrapMuPdfWithoutContext(muPdf: MuPdf.Module): MuPdf.Instance {
  return {
    ...muPdf,
    load(ctx: number, fileData: Buffer | ArrayBufferView, name = generateFileName()) {
      muPdf.FS.writeFile(name, fileData);
      const doc = muPdf.openDocument(ctx, name);
      muPdf.FS.unlink(name);
      return doc;
    },
  };
}


function wrapMuPdf(ctx: number, muPdf: MuPdf.Module): MuPdf.CommonContextInstance {

  const sharedContextMuPdf = {
    freeContext() {
      muPdf.freeContext(ctx);
    },

    openDocument(filename: string): MuPdf.DocumentHandle {
      return muPdf.openDocument(ctx, filename);
    },

    freeDocument(doc: MuPdf.DocumentHandle): void {
      return muPdf.freeDocument(ctx, doc);
    },

    documentTitle(doc: MuPdf.DocumentHandle): string {
      return muPdf.documentTitle(ctx, doc);
    },

    documentOutline(doc: MuPdf.DocumentHandle): HTMLElement {
      return muPdf.documentOutline(ctx, doc);
    },

    countPages(doc: MuPdf.DocumentHandle): number {
      return muPdf.countPages(ctx, doc);
    },

    pageWidth(doc: MuPdf.DocumentHandle, page: number, dpi: number): number {
      return muPdf.pageWidth(ctx, doc, page, dpi);
    },

    pageHeight(doc: MuPdf.DocumentHandle, page: number, dpi: number): number {
      return muPdf.pageHeight(ctx, doc, page, dpi);
    },

    pageLinks(doc: MuPdf.DocumentHandle, page: number, dpi: number): string {
      return muPdf.pageLinks(ctx, doc, page, dpi);
    },

    drawPageAsPNG(
      doc: MuPdf.DocumentHandle,
      page: number,
      dpi: number
    ): string {
      return muPdf.drawPageAsPNG(ctx, doc, page, dpi);
    },

    drawPageAsPNGRaw(
      doc: MuPdf.DocumentHandle,
      page: number,
      dpi: number
    ): Uint8Array {
      return muPdf.drawPageAsPNGRaw(ctx, doc, page, dpi);
    },

    drawPageAsHTML(doc: MuPdf.DocumentHandle, page: number): string {
      return muPdf.drawPageAsHTML(ctx, doc, page);
    },

    drawPageAsSVG(doc: MuPdf.DocumentHandle, page: number): string {
      return muPdf.drawPageAsSVG(ctx, doc, page);
    },

    getPageText(doc: MuPdf.DocumentHandle, page: number): string {
      return muPdf.getPageText(ctx, doc, page);
    },

    searchPageText(
      doc: MuPdf.DocumentHandle,
      page: number,
      searchString: string,
      maxHits: number
    ): MuPdf.Box[] {
      return muPdf.searchPageText(ctx, doc, page, searchString, maxHits);
    }
  }


  return {
    ...muPdf,
    ...sharedContextMuPdf,
    ctx,
    load(fileData: Buffer | ArrayBufferView, name = generateFileName()) {
      muPdf.FS.writeFile(name, fileData);
      const doc = muPdf.openDocument(ctx, name);
      muPdf.FS.unlink(name);
      return doc;
    },
  };
}

let i = 0;

function generateFileName() {
  return `tmp_${i++}.pdf`;
}
