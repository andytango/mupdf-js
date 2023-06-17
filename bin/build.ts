import { execSync } from "child_process";
import Docker from "dockerode";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { Stream } from "stream";

const MUPDF_VERSION = "1.20.0";

async function main() {
  await runDockerBuildCommand();
}

async function runDockerBuildCommand() {
  const docker = getDockerClient();
  const user = execSync("echo $(id -u):$(id -g)").toString().trim();

  console.log("Pulling docker image...");
  await pullImage(docker);

  console.log(`Running build command in docker container as user "${user}"`);
  await docker.run(
    "emscripten/emsdk",
    ["/opt/mupdf-js/bin/build.sh"],
    process.stdout,
    {
      HostConfig: {
        AutoRemove: true,
        Binds: [
          `${resolve(`./tmp/mupdf-${MUPDF_VERSION}-source`)}:/src`,
          `${resolve(`.`)}:/opt/mupdf-js`,
        ],
      },
      Env: [`HOST_USER=${user}`],
    }
  );
}

function pullImage(docker: Docker) {
  return new Promise((res, rej) => {
    docker.pull("emscripten/emsdk", (err: any, stream: Stream) => {
      if (err) {
        console.error("Error");
        return rej(err);
      }
      stream.pipe(createWriteStream("/dev/null"));
      stream.on("close", res);
    });
  });
}

function getDockerClient() {
  return new Docker();
}

main();
