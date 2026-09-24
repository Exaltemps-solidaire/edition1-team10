import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

// Enveloppe d'erreur uniforme imposée par le sujet (§17) : jamais de texte
// brut ou de stacktrace renvoyé au client, codes namespacés (auth.*,
// validation.*, resource.*).
export function erreur(
  c: Context,
  status: ContentfulStatusCode,
  code: string,
  message: string,
  details: Record<string, unknown> = {},
) {
  return c.json({ error: { code, message, details } }, status);
}
