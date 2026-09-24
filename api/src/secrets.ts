// Lecture des secrets applicatifs dans OpenBao (KV v2).
//
// VAULT_ADDR / VAULT_TOKEN / VAULT_PATH sont déjà injectés par
// podman-compose.yml (x-common-env). VAULT_PATH vaut "secret/<app>" — le
// mount KV v2 exige un segment "/data/" entre le mount et le chemin logique,
// sinon OpenBao répond 404 (piège documenté dans les guidances).
const VAULT_ADDR = process.env.VAULT_ADDR ?? "http://vault.internal:8200";
const VAULT_TOKEN = process.env.VAULT_TOKEN;
const VAULT_PATH = process.env.VAULT_PATH; // ex: "secret/sauvegarde-conformite"

interface Kv2Response {
  data: { data: Record<string, string> };
}

export async function readSecret(usage: string): Promise<Record<string, string>> {
  if (!VAULT_TOKEN || !VAULT_PATH) {
    throw new Error(
      "[secrets] VAULT_TOKEN/VAULT_PATH manquants — vérifie podman-compose.yml",
    );
  }
  const kv2Path = VAULT_PATH.replace(/^secret\//, "secret/data/");
  const url = `${VAULT_ADDR}/v1/${kv2Path}/${usage}`;
  const res = await fetch(url, { headers: { "X-Vault-Token": VAULT_TOKEN } });
  if (!res.ok) {
    throw new Error(
      `[secrets] lecture de ${kv2Path}/${usage} échouée (${res.status}) — ` +
        `bootstrap.sh a-t-il été exécuté pour cette app ?`,
    );
  }
  const body = (await res.json()) as Kv2Response;
  return body.data.data;
}
