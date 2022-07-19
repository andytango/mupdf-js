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
  mupdf.openDocument = Module.cwrap("openDocument", "number", ["string"]);
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
  mupdf.pageLinks = Module.cwrap("pageLinks", "string", [
    "number",
    "number",
    "number",
  ]);
  mupdf.drawPageAsPNG = Module.cwrap("drawPageAsPNG", "string", [
    "number",
    "number",
    "number",
  ]);
  mupdf.drawPageAsHTML = Module.cwrap("drawPageAsHTML", "string", [
    "number",
    "number",
  ]);
  mupdf.drawPageAsSVG = Module.cwrap("drawPageAsSVG", "string", [
    "number",
    "number",
  ]);
  mupdf.loadOutline = Module.cwrap("loadOutline", "number", ["number"]);
  mupdf.freeOutline = Module.cwrap("freeOutline", null, ["number"]);
  mupdf.outlineTitle = Module.cwrap("outlineTitle", "string", ["number"]);
  mupdf.outlinePage = Module.cwrap("outlinePage", "number", ["number"]);
  mupdf.outlineDown = Module.cwrap("outlineDown", "number", ["number"]);
  mupdf.outlineNext = Module.cwrap("outlineNext", "number", ["number"]);
  mupdf.getPageText = Module.cwrap("getPageText", "string", ["number", "number"]);
  const searchPageText = Module.cwrap("searchPageText", "string", ["number", "number", "string", "number"]);

  mupdf.searchPageText = (doc, pageNumber, searchString, maxHits) => {
    const resultStr = searchPageText(doc, pageNumber, searchString, maxHits);
    return resultStr.slice(0, -1).split('\n').map((line) => {
      const [x, y, w, h] = line.split(';').map(item => parseFloat(item));
      return {x, y, w, h};
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
