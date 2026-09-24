import { Hono } from "hono";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import {
  creerSession,
  creerUtilisateur,
  supprimerSession,
  trouverParEmail,
  verifyPassword,
} from "../auth";
import { erreur } from "../http";
import { requireAuth } from "../middleware/requireAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOKIE_SECURE = process.env.COOKIE_SECURE !== "false";

export const authRoutes = new Hono();

authRoutes.post("/inscription", async (c) => {
  const body = await c.req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const motDePasse = typeof body?.motDePasse === "string" ? body.motDePasse : "";
  const nom = typeof body?.nom === "string" ? body.nom.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return erreur(c, 422, "validation.email_invalide", "Adresse email invalide");
  }
  if (motDePasse.length < 8) {
    return erreur(
      c,
      422,
      "validation.mot_de_passe_trop_court",
      "Le mot de passe doit contenir au moins 8 caractères",
    );
  }
  if (!nom) {
    return erreur(c, 422, "validation.nom_requis", "Le nom est requis");
  }

  const existant = await trouverParEmail(email);
  if (existant) {
    return erreur(c, 409, "resource.already_exists", "Un compte existe déjà pour cet email");
  }

  const utilisateur = await creerUtilisateur(email, motDePasse, nom);
  const { token, expiresAt } = await creerSession(utilisateur.id);
  setCookie(c, "session", token, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    secure: COOKIE_SECURE,
    expires: expiresAt,
  });
  return c.json({ utilisateur }, 201);
});

authRoutes.post("/connexion", async (c) => {
  const body = await c.req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const motDePasse = typeof body?.motDePasse === "string" ? body.motDePasse : "";

  const utilisateur = email ? await trouverParEmail(email) : null;
  const valide = utilisateur ? await verifyPassword(motDePasse, utilisateur.password_hash) : false;
  if (!utilisateur || !valide) {
    return erreur(c, 401, "auth.invalid_credentials", "Email ou mot de passe incorrect");
  }

  const { token, expiresAt } = await creerSession(utilisateur.id);
  setCookie(c, "session", token, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    secure: COOKIE_SECURE,
    expires: expiresAt,
  });
  return c.json({
    utilisateur: { id: utilisateur.id, email: utilisateur.email, nom: utilisateur.nom },
  });
});

authRoutes.post("/deconnexion", async (c) => {
  const token = getCookie(c, "session");
  if (token) await supprimerSession(token);
  deleteCookie(c, "session", { path: "/" });
  return c.body(null, 204);
});

authRoutes.get("/moi", requireAuth, (c) => {
  return c.json({ utilisateur: c.var.user });
});
