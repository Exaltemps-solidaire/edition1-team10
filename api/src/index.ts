import { Hono } from "hono";

const APP_NAME = "sauvegarde-conformite";
const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 8081);

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok", app: APP_NAME }));

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`[api] ${APP_NAME} listening on :${PORT}`);
