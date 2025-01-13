import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { reactRouter } from "remix-hono/handler";
// @ts-ignore
import * as build from "./build/server/index.js";

const app = new Hono();
app.use(
  "*",
  serveStatic({
    root: "./build/client",
  }),
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
