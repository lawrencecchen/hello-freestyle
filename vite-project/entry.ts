import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { reactRouter } from "remix-hono/handler";
// @ts-ignore
import * as build from "./build/server";

const app = new Hono();
app.use(
  "*",
  serveStatic({
    root: "./build/client",
  }),
  reactRouter({
    build,
    mode: process.env.NODE_ENV as "development" | "production",
    // getLoadContext is optional, the default function is the same as here
    getLoadContext(c) {
      return c.env;
    },
  })
);

serve({
  fetch: app.fetch,
  port: 3000,
});
