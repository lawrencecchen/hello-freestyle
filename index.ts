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

  // Initialize ignore instance
  const ig = ignore();

  // Read .gitignore if it exists
  const gitignorePath = path.join(dirPath, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    ig.add(gitignoreContent);
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const relativePath = entry.name;
      // Skip if file is ignored by gitignore
      if (ig.ignores(relativePath)) {
        continue;
      }

      const filePath = path.join(dirPath, entry.name);
      const content = fs.readFileSync(filePath, "utf-8");
      files[entry.name] = { content };
    }
  }

  return files;
}

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

const files = readDirFiles("./vite-project");

const now = Date.now();
const result = await api.deployWeb(files, {
  // entrypoint: "./build/server/index.js",
  entrypoint: "./run.js",
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
