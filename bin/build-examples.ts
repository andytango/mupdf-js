import { mkdirSync, readFileSync, writeFileSync } from "fs";
import createMuPdf from "../dist";

main();

async function main() {
  const mupdf = await createMuPdf();
  const { FS, openDocument, countPages } = mupdf;
  const pdfFile = readFileSync("./examples/example.pdf");
  FS.writeFile("example.pdf", pdfFile);
  const doc = openDocument("example.pdf");
  const n = countPages(doc);

  ["png", "svg", "html", "text", "search"].forEach((ext) => {
    mkdirSync(`./examples/${ext}`, { recursive: true });
  });

  console.group("Generating example outputs...");
  for (let i = 1; i <= n; i++) {
    console.log("Page " + i + "");
    writePageToPngFile(i, mupdf, doc);
    writePageToPngRawFile(i, mupdf, doc);
    writePageToSvgFile(i, mupdf, doc);
    writePageToHtmlFile(i, mupdf, doc);
    writePageToTextFile(i, mupdf, doc);
    writePageSearchToFile(i, mupdf, doc);
  }
  console.groupEnd();
}

function writePageToPngFile(i: number, { drawPageAsPNG }: any, doc: any) {
  writeFileSync(
    `./examples/png/example-${i}.png`,
    decodeUri(drawPageAsPNG(doc, i, 600))
  );
}

function writePageToPngRawFile(i: number, { drawPageAsPNGRaw }: any, doc: any) {
  writeFileSync(
    `./examples/png/example-raw-${i}.png`,
    drawPageAsPNGRaw(doc, i, 600)
  );
}

function writePageToSvgFile(i: number, { drawPageAsSVG }: any, doc: any) {
  writeFileSync(`./examples/svg/example-${i}.svg`, drawPageAsSVG(doc, i));
}

function writePageToHtmlFile(i: number, { drawPageAsHTML }: any, doc: any) {
  writeFileSync(`./examples/html/example-${i}.html`, drawPageAsHTML(doc, i));
}

function writePageSearchToFile(i: number, { searchPageText }: any, doc: any) {
  writeFileSync(
    `./examples/search/example-${i}-search.json`,
    JSON.stringify(searchPageText(doc, i, 'lorem', 10), null, "  ")
  );
}

function writePageToTextFile(i: number, { getPageText }: any, doc: any) {
  writeFileSync(`./examples/text/example-${i}.txt`, getPageText(doc, i));
}


function decodeUri(uri: string) {
  return Buffer.from(uri.slice(23), "base64");
}
