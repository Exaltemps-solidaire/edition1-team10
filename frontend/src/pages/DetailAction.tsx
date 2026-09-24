import { useParams } from "react-router";

export function DetailAction() {
  const { actionId } = useParams();

  return (
    <section className="space-y-2">
      <h1 className="text-display text-primary">Détail de l'action</h1>
      <p className="text-body text-base-content">
        Les preuves déjà attachées à l'action {actionId} et celles qui
        manquent encore.
      </p>
    </section>
  );
}
