import { spawn } from "node:child_process";

const env = { ...process.env, NODE_ENV: "production" };

const serve = spawn(
  "./node_modules/.bin/react-router-serve",
  ["./build/server/index.js"],
  {
    env,
    stdio: "inherit",
  }
);

serve.on("error", (err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

serve.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Server exited with code ${code}`);
    process.exit(code);
  }
});
