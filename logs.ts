import { FreestyleSandboxes } from "freestyle-sandboxes";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

api.getWebLogs("c87c5e7d-937d-4ca1-bdf4-54a300b5ebd6").then((logs) => {
  console.log("Logs for project c87c5e7d-937d-4ca1-bdf4-54a300b5ebd6: ", logs);
});
