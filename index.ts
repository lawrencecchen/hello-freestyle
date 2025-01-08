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
          files[path.join(fileKey, subKey)] = value;
        }
      }
    } else if (entry.isFile()) {
      if (!ig.ignores(ignoreCheckPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        files[fileKey] = { content };
      }
    }
  }

  return files;
}

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
  baseUrl: "http://localhost:8080",
});

const files = readDirFiles("./vite-project/");

const now = Date.now();
const result = await api.deployWeb(files, {
  // entrypoint: "./build/server/index.js",
  entrypoint: "run.js",
});
// const result = await api.deployWeb({
// 	"index.js": {
// 		content: `
//             import http from 'node:http';
//             console.log('starting server');

//             const server = http.createServer(async(req, res) => {
//             // wait 5 seconds before responding
//             // await new Promise((resolve) => setTimeout(resolve, 5000));
//             res.writeHead(200, { 'Content-Type': 'text/plain' });
//             res.end('Welcome to New York its been waiting for you');
//             });

//             server.listen(3000, () => {
//             console.log('Server is running at http://localhost:3000');
//             });`,
// 	},
// });

console.log("Deployed website @ ", result.projectId);

console.log("Time taken: ", Date.now() - now);
