import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { Accueil } from "./pages/Accueil";
import { PlanAction } from "./pages/PlanAction";
import { DetailAction } from "./pages/DetailAction";
import { Alertes } from "./pages/Alertes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Accueil />} />
          <Route path="plan-action" element={<PlanAction />} />
          <Route path="plan-action/:actionId" element={<DetailAction />} />
          <Route path="alertes" element={<Alertes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
