import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const liens = [
  { to: "/", label: "Accueil", end: true },
  { to: "/plan-action", label: "Mon plan d'action" },
  { to: "/alertes", label: "Alertes récurrentes" },
];

export function Layout() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();

  async function onDeconnexion() {
    await deconnexion();
    navigate("/connexion", { replace: true });
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 shadow-(--shadow-raised) max-w-app mx-auto">
        <div className="flex-1 px-2">
          <span className="text-title text-primary">Sauvegarde Conformité</span>
        </div>
        <nav className="flex gap-1 px-2">
          {liens.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 px-2">
          {utilisateur && <span className="text-sm text-base-content/70">{utilisateur.nom}</span>}
          <button type="button" className="btn btn-sm btn-ghost" onClick={onDeconnexion}>
            Déconnexion
          </button>
        </div>
      </header>
      <main className="max-w-app mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
