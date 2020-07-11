import { readFileSync, writeFileSync } from "fs";
import initMuPdf from "../dist/libmupdf";

main();

async function main() {
  const mupdf = await initMuPdf();
  const { FS, openDocument, drawPageAsSVG } = mupdf;
  const pdfFile = readFileSync("./examples/example.pdf");
  FS.writeFile("example.pdf", pdfFile);
  const doc = openDocument("example.pdf");
  const svg = drawPageAsSVG(doc, 1, "600");
  writeFileSync("./examples/example.svg", svg);
}
