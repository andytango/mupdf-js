Module.noExitRuntime = true;
Module.noInitialRun = true;

Module.locateFile = function (path, prefix) {
  if (ENVIRONMENT_IS_NODE) {
    return prefix + path;
  }

  return path;
};



Module.onRuntimeInitialized = function () {
  Module.ccall("initContext");

  var isNode = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";

  function parseDto(ptr) {
    const dataLen = new Uint32Array(HEAPU8.slice(ptr, ptr + 4).buffer)[0];
    return HEAPU8.slice(ptr + 4, ptr + 4 + dataLen);
  }

  function uint8ArrayToString(data) {
    if (isNode) {
      return Buffer.from(data).toString('utf8');
    } else {
      return new TextDecoder().decode(data);
    }
  }

  var dropDto = Module.cwrap("dropDto", "", ["number"]);

  var openDocument = Module.cwrap("openDocument", "number", ["string"]);

  mupdf.openDocument = function (fileName) {
      var doc = openDocument(fileName);
      if (doc === 0) {
        throw new Error('Can\'t open document');
      }
      return doc;
  }

  mupdf.freeDocument = Module.cwrap("freeDocument", "null", ["number"]);
  mupdf.documentTitle = Module.cwrap("documentTitle", "string", ["number"]);
  mupdf.countPages = Module.cwrap("countPages", "number", ["number"]);
  mupdf.pageWidth = Module.cwrap("pageWidth", "number", [
    "number",
    "number",
    "number",
  ]);
  mupdf.pageHeight = Module.cwrap("pageHeight", "number", [
    "number",
    "number",
    "number",
  ]);

  const pageLinks = Module.cwrap("pageLinks", "number", [
    "number",
    "number",
    "number",
  ]);



  mupdf.pageLinks = (doc, pageNumber, dpi) => {
    const dto = pageLinks(doc, pageNumber, dpi);
    const data = parseDto(dto);
    const str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str;
  }


  const drawPageAsPNGRaw = Module.cwrap("drawPageAsPNGRaw", "number", [
    "number",
    "number",
    "number",
  ]);

  mupdf.drawPageAsPNGRaw = (doc, pageNumber, resolution) => {
    const dto = drawPageAsPNGRaw(doc, pageNumber, resolution);
    const data = parseDto(dto);
    dropDto(dto);
    return data;
  }

  const drawPageAsPNG = Module.cwrap("drawPageAsPNG", "number", [
    "number",
    "number",
    "number",
  ]);

  mupdf.drawPageAsPNG = (doc, pageNumber, resolution) => {
    const dto = drawPageAsPNG(doc, pageNumber, resolution);
    const data = parseDto(dto);
    const str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str;
  }


  const drawPageAsHTML = Module.cwrap("drawPageAsHTML", "number", [
    "number",
    "number",
  ]);

  mupdf.drawPageAsHTML = (doc, pageNumber) => {
    const dto = drawPageAsHTML(doc, pageNumber);
    const data = parseDto(dto);
    const str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str;
  }

  const drawPageAsSVG = Module.cwrap("drawPageAsSVG", "number", [
    "number",
    "number",
  ]);

  mupdf.drawPageAsSVG = (doc, pageNumber) => {
    const dto = drawPageAsSVG(doc, pageNumber);
    const data = parseDto(dto);
    const str = uint8ArrayToString( data.slice(0, -1));
    dropDto(dto);
    return str;
  }

  mupdf.loadOutline = Module.cwrap("loadOutline", "number", ["number"]);
  mupdf.freeOutline = Module.cwrap("freeOutline", null, ["number"]);
  mupdf.outlineTitle = Module.cwrap("outlineTitle", "string", ["number"]);
  mupdf.outlinePage = Module.cwrap("outlinePage", "number", ["number"]);
  mupdf.outlineDown = Module.cwrap("outlineDown", "number", ["number"]);
  mupdf.outlineNext = Module.cwrap("outlineNext", "number", ["number"]);

  const getPageText = Module.cwrap("getPageText", "number", ["number", "number"]);

  mupdf.getPageText = ((doc, pageNumber) => {
    const dto = getPageText(doc, pageNumber);
    const data = parseDto(dto);
    const str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str
  });

  const searchPageText = Module.cwrap("searchPageText", "number", ["number", "number", "string", "number"]);

  mupdf.searchPageText = (doc, pageNumber, searchString, maxHits) => {
    const dto = searchPageText(doc, pageNumber, searchString, maxHits);
    const data = parseDto(dto);
    const resultStr = uint8ArrayToString(data);
    return resultStr.slice(0, -1).split('\n').map((line) => {
      const [x, y, w, h, c] = line.split(';').map(item => parseFloat(item));
      return {x, y, w, h, isContinuation: c === 1};
    })
  }
};

mupdf.documentOutline = function (doc) {
  function makeOutline(node) {
    var ul = document.createElement("ul");
    while (node) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#page" + mupdf.outlinePage(node);
      a.textContent = mupdf.outlineTitle(node);
      li.appendChild(a);
      var down = mupdf.outlineDown(node);
      if (down) {
        li.appendChild(makeOutline(down));
      }
      ul.appendChild(li);
      node = mupdf.outlineNext(node);
    }
    return ul;
  }
  var root = mupdf.loadOutline(doc);
  if (root) {
    var ul = makeOutline(root);
    mupdf.freeOutline(root);
    return ul;
  }
  return null;
};
