import { FreestyleSandboxes } from "freestyle-sandboxes";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

const verification = await api.createDomainVerificationRequest("bin.new");

console.log(verification);
