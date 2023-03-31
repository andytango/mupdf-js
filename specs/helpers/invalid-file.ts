import { readFileSync } from "fs";

let exampleFile = null as null | Buffer;

export function getInvalidFile() {
  if (!exampleFile) {
    exampleFile = readFileSync("./examples/invalid.pdf");
  }

  return exampleFile;
}
