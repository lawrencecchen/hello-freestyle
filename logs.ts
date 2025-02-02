import { FreestyleSandboxes } from "freestyle-sandboxes";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

api.getWebLogs("2df70dfe-1cf6-4c37-b470-c2ecaccb17af").then((logs) => {
  console.log("Logs for project 2df70dfe-1cf6-4c37-b470-c2ecaccb17af: ", logs);
});
