import { execSync, spawn } from "child_process";
import Docker from "dockerode";
import needle from "needle";
import rimraf from "rimraf";
import { resolve } from "path";

const MUPDF_VERISON = "1.17.0";

async function main() {
  // await clearTmpDirectory();
  // await downloadMuPdf();
  await runDockerBuildCommand();
}

function clearTmpDirectory() {
  console.log("Clearing tmp directory...");
  return new Promise((res) => rimraf("./tmp", res));
}

function downloadMuPdf() {
  return new Promise((res) => {
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
  return `https://mupdf.com/downloads/archive/mupdf-${MUPDF_VERISON}-source.tar.gz`;
}

async function runDockerBuildCommand() {
  const docker = getDockerClient();
  const user = execSync("echo $(id -u):$(id -g)").toString().trim();

  console.log("Pulling docker image...");
  await docker.pull("trzeci/emscripten");

  console.log(`Running build command in docker container as user "${user}"`);
  await docker.run(
    "trzeci/emscripten",
    ["/opt/mupdf-js/bin/build.sh"],
    process.stdout,
    {
      HostConfig: {
        AutoRemove: true,
        Binds: [
          `${resolve(`./tmp/mupdf-${MUPDF_VERISON}-source`)}:/src`,
          `${resolve(`.`)}:/opt/mupdf-js`,
          `${resolve(`./bin/Makefile`)}:/src/platform/wasm/Makefile`,
        ],
      },
      Env: [`HOST_USER=${user}`],
    }
  );
}

function getDockerClient() {
  return new Docker();
}

main();
