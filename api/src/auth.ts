import { randomBytes, randomUUID } from "node:crypto";
import { pgPool } from "./db";

export interface User {
  id: string;
  email: string;
  nom: string;
}

const SESSION_DUREE_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export function hashPassword(motDePasse: string): Promise<string> {
  return Bun.password.hash(motDePasse, { algorithm: "argon2id" });
}

export function verifyPassword(motDePasse: string, hash: string): Promise<boolean> {
  return Bun.password.verify(motDePasse, hash);
}

export async function creerUtilisateur(
  email: string,
  motDePasse: string,
  nom: string,
): Promise<User> {
  const id = randomUUID();
  const passwordHash = await hashPassword(motDePasse);
  await pgPool.query(
    "INSERT INTO users (id, email, password_hash, nom) VALUES ($1, $2, $3, $4)",
    [id, email, passwordHash, nom],
  );
  return { id, email, nom };
}

export async function trouverParEmail(
  email: string,
): Promise<(User & { password_hash: string }) | null> {
  const { rows } = await pgPool.query<{
    id: string;
    email: string;
    password_hash: string;
    nom: string;
  }>("SELECT id, email, password_hash, nom FROM users WHERE email = $1", [email]);
  return rows[0] ?? null;
}

export async function creerSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DUREE_MS);
  await pgPool.query(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)",
    [token, userId, expiresAt],
  );
  return { token, expiresAt };
}

export async function resoudreSession(token: string): Promise<User | null> {
  const { rows } = await pgPool.query<{ id: string; email: string; nom: string }>(
    `SELECT u.id, u.email, u.nom
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token = $1 AND s.expires_at > now()`,
    [token],
  );
  return rows[0] ?? null;
}

export async function supprimerSession(token: string): Promise<void> {
  await pgPool.query("DELETE FROM sessions WHERE token = $1", [token]);
}
