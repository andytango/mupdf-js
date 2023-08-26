import "emscripten";

export namespace MuPdf {

  export interface DocumentHandle {
  }

  export interface MuPdfLogger {
    log?(...args: any[]): void;

    errorLog?(...args: any[]): void;
  }


  export interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  export interface CommonContextInstance extends CommonContextModule {
    load(fileData: Buffer | ArrayBufferView, name?: string): DocumentHandle;
  }

  export interface CommonContextModule extends BaseModule {

    ctx: number;
    freeContext(): void;


    openDocument(filename: string): DocumentHandle;

    freeDocument(doc: DocumentHandle): void;

    documentTitle(doc: DocumentHandle): string;

    documentOutline(doc: DocumentHandle): HTMLElement;

    countPages(doc: DocumentHandle): number;

    pageWidth(doc: DocumentHandle, page: number, dpi: number): number;

    pageHeight(doc: DocumentHandle, page: number, dpi: number): number;

    pageLinks(doc: DocumentHandle, page: number, dpi: number): string;

    drawPageAsPNG(
      doc: DocumentHandle,
      page: number,
      dpi: number
    ): string;

    drawPageAsPNGRaw(
      doc: DocumentHandle,
      page: number,
      dpi: number
    ): Uint8Array;

    drawPageAsHTML(doc: DocumentHandle, page: number): string;

    drawPageAsSVG(doc: DocumentHandle, page: number): string;

    getPageText(doc: DocumentHandle, page: number): string;

    searchPageText(
      doc: DocumentHandle,
      page: number,
      searchString: string,
      maxHits: number
    ): Box[];
  }

  export interface Instance extends Module {
    load(ctx: number, fileData: Buffer | ArrayBufferView, name?: string): DocumentHandle;
  }

  export interface Module extends BaseModule {
    createContext(): number;

    freeContext(ctx: number): void;

    openDocument(ctx: number, filename: string): DocumentHandle;

    freeDocument(ctx: number, doc: DocumentHandle): void;

    documentTitle(ctx: number, doc: DocumentHandle): string;

    documentOutline(ctx: number, doc: DocumentHandle): HTMLElement;

    countPages(ctx: number, doc: DocumentHandle): number;

    pageWidth(ctx: number, doc: DocumentHandle, page: number, dpi: number): number;

    pageHeight(ctx: number, doc: DocumentHandle, page: number, dpi: number): number;

    pageLinks(ctx: number, doc: DocumentHandle, page: number, dpi: number): string;

    drawPageAsPNG(
      ctx: number,
      doc: DocumentHandle,
      page: number,
      dpi: number
    ): string;

    drawPageAsPNGRaw(
      ctx: number,
      doc: DocumentHandle,
      page: number,
      dpi: number
    ): Uint8Array;

    drawPageAsHTML(ctx: number, doc: DocumentHandle, page: number): string;

    drawPageAsSVG(ctx: number, doc: DocumentHandle, page: number): string;

    getPageText(ctx: number, doc: DocumentHandle, page: number): string;

    searchPageText(
      ctx: number,
      doc: DocumentHandle,
      page: number,
      searchString: string,
      maxHits: number
    ): Box[];
  }

  interface BaseModule extends EmscriptenModule {
    FS: typeof FS;
    setLogger(logger: MuPdfLogger): void;
  }
}

declare const initMuPdf: EmscriptenModuleFactory<MuPdf.Module>;

export default initMuPdf;
