import { mkdirSync, readFileSync, writeFileSync } from "fs";
import initMuPdf from "../dist/libmupdf";

main();

async function main() {
  const mupdf = await initMuPdf();
  const { FS, openDocument, countPages } = mupdf;
  const pdfFile = readFileSync("./examples/example.pdf");
  FS.writeFile("example.pdf", pdfFile);
  const doc = openDocument("example.pdf");
  const n = countPages(doc);

  ["png", "svg", "html"].forEach((ext) => {
    mkdirSync(`./examples/${ext}`, { recursive: true });
  });

  console.group("Generating example outputs...");
  for (let i = 1; i <= n; i++) {
    console.log("Page " + i + "");
    writePageToPngFile(i, mupdf, doc);
    writePageToSvgFile(i, mupdf, doc);
    writePageToHtmlFile(i, mupdf, doc);
    getPageText(i, mupdf, doc);
  }
  console.groupEnd();

  console.group("Stress test...");
  let iterations = 100000;
  while (iterations--) {
    for (let i = 1; i <= n; i++) {
      mupdf.searchPageText(doc, i, "a", 1000);
      getPageText(i, mupdf, doc);
    }
  }
  console.groupEnd();
}

function writePageToPngFile(i: number, { drawPageAsPNG }: any, doc: any) {
  writeFileSync(
    `./examples/png/example-${i}.png`,
    decodeUri(drawPageAsPNG(doc, i, 600))
  );
}

function writePageToSvgFile(i: number, { drawPageAsSVG }: any, doc: any) {
  writeFileSync(`./examples/svg/example-${i}.svg`, drawPageAsSVG(doc, i));
}

function writePageToHtmlFile(i: number, { drawPageAsHTML }: any, doc: any) {
  writeFileSync(`./examples/html/example-${i}.html`, drawPageAsHTML(doc, i));
}

function getPageText(i: number, { getPageText }: any, doc: any) {
  const text = getPageText(doc, i);
  console.log('Page text', i, text);
}


function decodeUri(uri: string) {
  return Buffer.from(uri.slice(23), "base64");
}
