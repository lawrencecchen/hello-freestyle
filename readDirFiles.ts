import ignore from "ignore";
import fs from "node:fs";
import path from "node:path";

interface FileContent {
  kind: "file";
  content: string;
  encoding: string;
}

export function readDirFiles(dirPath: string): Record<string, FileContent> {
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
          files[fileKey] = { kind: "file", content, encoding: "base64" };
        } else {
          const content = fs.readFileSync(fullPath, "utf-8");
          files[fileKey] = { kind: "file", content, encoding: "utf-8" };
        }
      }
    }
  }

  return files;
}
