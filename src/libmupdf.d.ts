import "emscripten";

type FSInstance = typeof FS;

export namespace MuPdf {
  export interface DocumentHandle {}
  type pageNumber = number;
  type resolution = number;

  interface Instance extends Module {
    load(fileData: Buffer | ArrayBufferView, name?: string): DocumentHandle;
  }

  interface Module extends EmscriptenModule {
    FS: FSInstance;

    openDocument(filename: string): DocumentHandle;

    freeDocument(doc: DocumentHandle): void;

    documentTitle(doc: DocumentHandle): string;

    documentOutline(doc: DocumentHandle): HTMLElement;

    countPages(doc: DocumentHandle): number;

    pageWidth(doc: DocumentHandle, page: pageNumber, dpi: resolution): number;

    pageHeight(doc: DocumentHandle, page: pageNumber, dpi: resolution): number;

    pageLinks(doc: DocumentHandle, page: pageNumber, dpi: resolution): string;

    drawPageAsPNG(
      doc: DocumentHandle,
      page: pageNumber,
      dpi: resolution
    ): string;

    drawPageAsHTML(doc: DocumentHandle, page: pageNumber): void;

    drawPageAsSVG(doc: DocumentHandle, page: pageNumber): void;
  }
}

declare const initMuPdf: EmscriptenModuleFactory<MuPdf.Module>;

export default initMuPdf;
