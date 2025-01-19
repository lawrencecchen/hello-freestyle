import { FreestyleSandboxes } from "freestyle-sandboxes";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

api.getWebLogs("d7cc82e1-ec36-4a6d-913c-bfee7e0ce282").then((logs) => {
  console.log("Logs for project d7cc82e1-ec36-4a6d-913c-bfee7e0ce282: ", logs);
});
