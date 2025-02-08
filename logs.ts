import { FreestyleSandboxes } from "freestyle-sandboxes";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

const id = "767914ed-5c8a-4c2c-b05e-063570120840";
// const id = "67606654-1a3f-41b3-bde1-34329c0a0b32";

api.getWebLogs(id).then((logs) => {
  console.log(`Logs for project ${id}:`, logs);
});
