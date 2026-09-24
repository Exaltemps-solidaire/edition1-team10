import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Accueil } from "./pages/Accueil";
import { PlanAction } from "./pages/PlanAction";
import { DetailAction } from "./pages/DetailAction";
import { Alertes } from "./pages/Alertes";
import { Connexion } from "./pages/Connexion";
import { Inscription } from "./pages/Inscription";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="connexion" element={<Connexion />} />
          <Route path="inscription" element={<Inscription />} />
          <Route element={<Layout />}>
            <Route index element={<Accueil />} />
            <Route path="plan-action" element={<PlanAction />} />
            <Route path="plan-action/:actionId" element={<DetailAction />} />
            <Route path="alertes" element={<Alertes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
