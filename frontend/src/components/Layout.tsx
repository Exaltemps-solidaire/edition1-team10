import { NavLink, Outlet } from "react-router";

const liens = [
  { to: "/", label: "Accueil", end: true },
  { to: "/plan-action", label: "Mon plan d'action" },
  { to: "/alertes", label: "Alertes récurrentes" },
];

export function Layout() {
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
      </header>
      <main className="max-w-app mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
