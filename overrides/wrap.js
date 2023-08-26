Module.noExitRuntime = true;
Module.noInitialRun = true;

Module.locateFile = function (path, prefix) {
  if (ENVIRONMENT_IS_NODE) {
    return prefix + path;
  }

  return path;
};

var logger = {
  log: console.log,
  errorLog: console.warn
}

Module.printErr = function (...args) {
  if (logger.errorLog) {
    logger.errorLog(...args);
  }
}

Module.print = function (...args) {
  if (logger.log) {
    logger.log(...args);
  }
}

Module.onRuntimeInitialized = function () {
  var isNode = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";

  function cloneData(src)  {
    if (isNode) {
      return Buffer.from(src);
    } else {
      var dst = new ArrayBuffer(src.byteLength);
      new Uint8Array(dst).set(new Uint8Array(src));
      return dst;
    }
  }
  function parseDto(ptr) {
    var dataLen = new Uint32Array(HEAPU8.slice(ptr, ptr + 4).buffer)[0];
    return cloneData(HEAPU8.slice(ptr + 4, ptr + 4 + dataLen));
  }

  function uint8ArrayToString(data) {
    if (isNode) {
      return Buffer.from(data).toString('utf8');
    } else {
      return new TextDecoder().decode(data);
    }
  }

  mupdf.setLogger = function(newLogger) {
    logger.log = newLogger.log;
    logger.errorLog = newLogger.errorLog;
  }



  var dropDto = Module.cwrap("dropDto", "", ["number"]);

  mupdf.createContext = Module.cwrap("createContext", "number", []);
  mupdf.freeContext = Module.cwrap("freeContext", "", ["number"]);


  var openDocument = Module.cwrap("openDocument", "number", ["number", "string"]);

  mupdf.openDocument = function (ctx, fileName) {
      var doc = openDocument(ctx, fileName);
      if (doc === 0) {
        throw new Error('Can\'t open document');
      }
      return doc;
  }

  mupdf.freeDocument = Module.cwrap("freeDocument", "null", ["number", "number"]);
  mupdf.documentTitle = Module.cwrap("documentTitle", "string", ["number", "number"]);
  mupdf.countPages = Module.cwrap("countPages", "number", ["number", "number"]);
  mupdf.pageWidth = Module.cwrap("pageWidth", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);
  mupdf.pageHeight = Module.cwrap("pageHeight", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);

  var pageLinks = Module.cwrap("pageLinks", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);



  mupdf.pageLinks = function (ctx, doc, pageNumber, dpi) {
    var dto = pageLinks(ctx, doc, pageNumber, dpi);
    var data = parseDto(dto);
    var str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str;
  }


  var drawPageAsPNGRaw = Module.cwrap("drawPageAsPNGRaw", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);

  mupdf.drawPageAsPNGRaw = function (ctx, doc, pageNumber, resolution) {
    var dto = drawPageAsPNGRaw(ctx, doc, pageNumber, resolution);
    var data = parseDto(dto);
    dropDto(dto);
    return data;
  }

  var drawPageAsPNG = Module.cwrap("drawPageAsPNG", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);

  mupdf.drawPageAsPNG = function (ctx, doc, pageNumber, resolution) {
    var dto = drawPageAsPNG(ctx, doc, pageNumber, resolution);
    var data = parseDto(dto);
    var str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str;
  }


  var drawPageAsHTML = Module.cwrap("drawPageAsHTML", "number", [
    "number",
    "number",
    "number",
  ]);

  mupdf.drawPageAsHTML = function (ctx, doc, pageNumber) {
    var dto = drawPageAsHTML(ctx, doc, pageNumber);
    var data = parseDto(dto);
    var str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str;
  }

  var drawPageAsSVG = Module.cwrap("drawPageAsSVG", "number", [
    "number",
    "number",
    "number",
  ]);

  mupdf.drawPageAsSVG = function (ctx, doc, pageNumber) {
    var dto = drawPageAsSVG(ctx, doc, pageNumber);
    var data = parseDto(dto);
    var str = uint8ArrayToString( data.slice(0, -1));
    dropDto(dto);
    return str;
  }

  mupdf.loadOutline = Module.cwrap("loadOutline", "number", ["number", "number"]);
  mupdf.freeOutline = Module.cwrap("freeOutline", null, ["number", "number"]);
  mupdf.outlineTitle = Module.cwrap("outlineTitle", "string", ["number"]);
  mupdf.outlinePage = Module.cwrap("outlinePage", "number", ["number", "number"]);
  mupdf.outlineDown = Module.cwrap("outlineDown", "number", ["number"]);
  mupdf.outlineNext = Module.cwrap("outlineNext", "number", ["number"]);

  var getPageText = Module.cwrap("getPageText", "number", ["number", "number", "number"]);

  mupdf.getPageText = function(ctx, doc, pageNumber) {
    var dto = getPageText(ctx, doc, pageNumber);
    var data = parseDto(dto);
    var str = uint8ArrayToString(data.slice(0, -1));
    dropDto(dto);
    return str
  };

  var searchPageText = Module.cwrap("searchPageText", "number", ["number", "number", "number", "string", "number"]);

  mupdf.searchPageText = function (ctx, doc, pageNumber, searchString, maxHits) {
    var dto = searchPageText(ctx, doc, pageNumber, searchString, maxHits);
    var data = parseDto(dto);
    var resultStr = uint8ArrayToString(data);
    return resultStr.slice(0, -1).split('\n').map(function (line) {
      var [x, y, w, h, c] = line.split(';').map(function (item) { return parseFloat(item); });
      return {x, y, w, h, isContinuation: c === 1};
    })
  }
};

mupdf.documentOutline = function (ctx, doc) {
  function makeOutline(node) {
    var ul = document.createElement("ul");
    while (node) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#page" + mupdf.outlinePage(ctx, node);
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
  var root = mupdf.loadOutline(ctx, doc);
  if (root) {
    var ul = makeOutline(root);
    mupdf.freeOutline(ctx, root);
    return ul;
  }
  return null;
};
