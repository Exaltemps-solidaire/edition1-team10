import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { resoudreSession, type User } from "../auth";
import { erreur } from "../http";

export const requireAuth = createMiddleware<{ Variables: { user: User } }>(
  async (c, next) => {
    const token = getCookie(c, "session");
    const user = token ? await resoudreSession(token) : null;
    if (!user) {
      return erreur(c, 401, "auth.unauthenticated", "Authentification requise");
    }
    c.set("user", user);
    await next();
  },
);
