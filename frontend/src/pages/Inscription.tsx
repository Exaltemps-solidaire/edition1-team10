import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

export function Inscription() {
  const { inscription } = useAuth();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoiEnCours(true);
    try {
      await inscription(email, motDePasse, nom);
      navigate("/", { replace: true });
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <section className="max-w-sm mx-auto space-y-4">
      <h1 className="text-display text-primary">Inscription</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="form-control">
          <span className="label-text">Nom</span>
          <input
            type="text"
            className="input input-bordered w-full"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Email</span>
          <input
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Mot de passe</span>
          <input
            type="password"
            className="input input-bordered w-full"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            minLength={8}
            required
          />
        </label>
        {erreur && <p className="text-error text-sm">{erreur}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={envoiEnCours}>
          Créer mon compte
        </button>
      </form>
      <p className="text-sm">
        Déjà un compte ? <Link to="/connexion" className="link link-primary">Se connecter</Link>
      </p>
    </section>
  );
}
