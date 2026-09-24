import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "../lib/api";

export interface Utilisateur {
  id: string;
  email: string;
  nom: string;
}

interface AuthContextValue {
  utilisateur: Utilisateur | null;
  chargement: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  inscription: (email: string, motDePasse: string, nom: string) => Promise<void>;
  deconnexion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    apiFetch<{ utilisateur: Utilisateur }>("/auth/moi")
      .then((res) => setUtilisateur(res.utilisateur))
      .catch(() => setUtilisateur(null))
      .finally(() => setChargement(false));
  }, []);

  async function connexion(email: string, motDePasse: string) {
    const res = await apiFetch<{ utilisateur: Utilisateur }>("/auth/connexion", {
      method: "POST",
      body: JSON.stringify({ email, motDePasse }),
    });
    setUtilisateur(res.utilisateur);
  }

  async function inscription(email: string, motDePasse: string, nom: string) {
    const res = await apiFetch<{ utilisateur: Utilisateur }>("/auth/inscription", {
      method: "POST",
      body: JSON.stringify({ email, motDePasse, nom }),
    });
    setUtilisateur(res.utilisateur);
  }

  async function deconnexion() {
    await apiFetch("/auth/deconnexion", { method: "POST" });
    setUtilisateur(null);
  }

  return (
    <AuthContext.Provider value={{ utilisateur, chargement, connexion, inscription, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  return ctx;
}
