import { FreestyleSandboxes } from "freestyle-sandboxes";
import fs from "node:fs";
import path from "node:path";
import ignore from "ignore";

interface FileContent {
  content: string;
  encoding?: string;
}

function readDirFiles(dirPath: string): Record<string, FileContent> {
  const files: Record<string, FileContent> = {};
  const ig = ignore();
  ig.add("node_modules");

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    // Use path relative to 'dirPath' instead of the process cwd
    const fileKey = path.relative(dirPath, fullPath);

    // Keep ignore checks with a path relative to cwd
    const ignoreCheckPath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (!ig.ignores(ignoreCheckPath)) {
        const subFiles = readDirFiles(fullPath);
        for (const [subKey, value] of Object.entries(subFiles)) {
          // files["./" + path.join(fileKey, subKey)] = value;
          files[path.join(fileKey, subKey)] = value;
        }
      }
    } else if (entry.isFile()) {
      if (!ig.ignores(ignoreCheckPath)) {
        const ext = path.extname(entry.name).toLowerCase();
        const isImage = [
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".webp",
          ".ico",
        ].includes(ext);

        if (isImage) {
          const content = fs.readFileSync(fullPath, "base64");
          files[fileKey] = { content, encoding: "base64" };
        } else {
          const content = fs.readFileSync(fullPath, "utf-8");
          files[fileKey] = { content };
        }
      }
    }
  }

  return files;
}

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
  // baseUrl: "http://localhost:8080",
});

const files = readDirFiles("./vite-project/");
console.log(files);

const now = Date.now();
const result = await api.deployWeb(files, {
  // entrypoint: "./build/server/index.js",
  entrypoint: "run.js",
  domains: ["testing12345.style.dev"],
});

console.log(result);
console.log("Deployed website @ ", result.deploymentId);

console.log("Time taken: ", Date.now() - now);

// api.getWebLogs(result.deploymentId).then((logs) => {
//   console.log(`Logs for project ${result.deploymentId}:`, logs);
// });
