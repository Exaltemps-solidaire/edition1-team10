import { Hono } from "hono";
import { migrate } from "./db";
import { authRoutes } from "./routes/auth";

const APP_NAME = "sauvegarde-conformite";
const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 8081);

await migrate();

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok", app: APP_NAME }));
app.route("/api/v1/auth", authRoutes);

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`[api] ${APP_NAME} listening on :${PORT}`);
