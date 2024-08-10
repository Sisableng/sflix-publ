import { Hono } from "hono";
import { handle } from "hono/vercel";
import movies from "./movies";

// export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  const { name } = c.req.query();

  return c.json({
    message: `Hello ${name}`,
  });
});

const routes = app.route("/movies", movies);

export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof routes;
