import { spawn } from "child_process";
import { mkdirSync } from "fs";
import needle from "needle";
import rimraf from "rimraf";

const MUPDF_VERSION = "1.20.0";

async function main() {
  await clearTmpDirectory();
  createTmpDirectory();

  if (process.env.USE_MUPDF_MASTER === "true") {
    await cloneRepoMaster();
    return;
  }

  await downloadMuPdf();
}

function clearTmpDirectory() {
  console.log("Clearing tmp directory...");
  return new Promise((res) => rimraf("./tmp", res));
}

function createTmpDirectory() {
  try {
    mkdirSync("./tmp");
  } catch (e: any) {
    if (e.code === "EEXIST") {
      console.log("tmp directory already exists");
      return
    }

    throw e;
  }
}

function cloneRepoMaster() {
  return new Promise<void>((res, rej) => {
    console.log("Cloning MuPdf master archive...");
    spawn(
      "git",
      [
        "clone",
        "--recurse-submodules",
        "https://github.com/ArtifexSoftware/mupdf.git",
        "tmp/mupdf-master",
      ],
      { stdio: "inherit" }
    ).on("close", () => {
      console.log("Master archive downloaded");
      res();
    });
  });
}

function downloadMuPdf() {
  return new Promise<void>((res) => {
    console.log("Downloading MuPdf sources...");
    const tar = spawn("tar", ["-zxf", "-", "-C", "./tmp"]);
    tar.stdout.pipe(process.stderr);
    tar.stderr.pipe(process.stderr);
    needle.get(getMuPdfUrl()).pipe(tar.stdin);
    tar.on("exit", () => {
      console.log("MuPDF downloaded");
      res();
    });
  });
}

function getMuPdfUrl(): string {
  return `https://mupdf.com/downloads/archive/mupdf-${MUPDF_VERSION}-source.tar.gz`;
}

main();
