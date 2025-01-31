import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { reactRouter } from "remix-hono/handler";
import * as build from "./build/server/index.js";

const app = new Hono();

app.use(
  "/assets/*",
  serveStatic({
    root: "./build/client",
  })
);
app.use(
  "/favicon.ico",
  serveStatic({
    path: "./build/client/favicon.ico",
  })
);

app.use(
  "*",
  reactRouter({
    build,
    mode: process.env.NODE_ENV,
    getLoadContext(c) {
      return c.env;
    },
  })
);

// eslint-disable-next-line no-undef
Deno.serve(app.fetch);
