import { readDirFiles } from "./readDirFiles";

const accessToken = process.env["DEPLOY_ACCESS_TOKEN"];
const orgId = process.env["DEPLOY_ORG_ID"];
const API = "https://api.deno.com/v1";
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

// 2.) Create a new project
const pr = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: null, // randomly generates project name
  }),
});

const project = await pr.json();

const files = readDirFiles("./vite-project");
console.log(files);

// dumb patch
files["build/server/index.js"].content = files[
  "build/server/index.js"
].content.replace('"react-dom/server"', '"react-dom/server.node"');

// 3.) Deploy a "hello world" server to the new project
const dr = await fetch(`${API}/projects/${project.id}/deployments`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    entryPointUrl: "main.ts",
    assets: files,
    envVars: {},
  }),
});

const deployment = await dr.json();

console.log(dr.status);
console.log(
  "Visit your site here:",
  `https://${project.name}-${deployment.id}.deno.dev`
);
