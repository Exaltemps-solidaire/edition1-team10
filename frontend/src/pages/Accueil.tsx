import { useState } from "react";

type StatutAction = "retard" | "proche" | "a_jour";

interface Preuve {
  id: string;
  nom: string;
  fournie: boolean;
  date?: string;
  auteur?: string;
}

interface Action {
  id: string;
  titre: string;
  referentiel: string;
  recurrence?: string;
  responsable: string;
  echeance: string;
  statut: StatutAction;
  ecart: string;
  preuves: Preuve[];
}

// Données factices en attendant l'API — aucun seed n'existe encore (cf. README).
const actions: Action[] = [
  {
    id: "a1",
    titre: "Vérification extincteurs — site Nord",
    referentiel: "Obligation de l'établissement",
    recurrence: "tous les 6 mois",
    responsable: "Camille Dupont",
    echeance: "2026-09-20",
    statut: "retard",
    ecart: "Écart relevé : les vérifications semestrielles des bâtiments B et C n'ont pas été réalisées dans les délais.",
    preuves: [
      { id: "a1-1", nom: "Rapport de vérification — bâtiment A", fournie: true, date: "12/03/2026", auteur: "C. Dupont" },
      { id: "a1-2", nom: "Rapport de vérification — bâtiment B", fournie: false },
      { id: "a1-3", nom: "Rapport de vérification — bâtiment C", fournie: false },
      { id: "a1-4", nom: "Attestation de conformité prestataire", fournie: false },
    ],
  },
  {
    id: "a2",
    titre: "Audit interne — process d'admission",
    referentiel: "Évaluation HAS 2025",
    responsable: "Sophie Nguyen",
    echeance: "2026-09-18",
    statut: "retard",
    ecart: "Écart relevé : le processus d'admission n'a pas été audité depuis la dernière évaluation HAS.",
    preuves: [
      { id: "a2-1", nom: "Grille d'audit complétée", fournie: false },
      { id: "a2-2", nom: "Compte rendu de restitution", fournie: false },
      { id: "a2-3", nom: "Plan d'action correctif", fournie: false },
    ],
  },
  {
    id: "a3",
    titre: "Mise à jour du registre RGPD",
    referentiel: "Contrôle Département 2025",
    responsable: "Camille Dupont",
    echeance: "2026-09-28",
    statut: "proche",
    ecart: "Écart relevé : le registre des traitements ne couvre pas encore les nouveaux outils déployés cette année.",
    preuves: [
      { id: "a3-1", nom: "Registre des traitements v2026", fournie: true, date: "05/09/2026", auteur: "C. Dupont" },
      { id: "a3-2", nom: "Analyse d'impact — nouveaux traitements", fournie: true, date: "10/09/2026", auteur: "C. Dupont" },
      { id: "a3-3", nom: "Preuve de diffusion aux équipes", fournie: false },
    ],
  },
  {
    id: "a4",
    titre: "Mise à jour protocole incendie",
    referentiel: "Obligation de l'établissement",
    recurrence: "chaque année",
    responsable: "Karim Belkacem",
    echeance: "2026-09-30",
    statut: "proche",
    ecart: "Écart relevé : le compte rendu de l'exercice d'évacuation annuel n'a pas été versé au dossier.",
    preuves: [
      { id: "a4-1", nom: "Protocole mis à jour", fournie: true, date: "20/08/2026", auteur: "K. Belkacem" },
      { id: "a4-2", nom: "Compte rendu de l'exercice d'évacuation", fournie: false },
    ],
  },
  {
    id: "a5",
    titre: "Mise à jour du DUERP",
    referentiel: "Obligation · suivi réglementaire",
    recurrence: "chaque année",
    responsable: "Sophie Nguyen",
    echeance: "2026-10-02",
    statut: "proche",
    ecart: "Écart relevé : le document unique n'intègre pas les risques identifiés lors du dernier CSE.",
    preuves: [
      { id: "a5-1", nom: "DUERP actualisé", fournie: false },
      { id: "a5-2", nom: "Compte rendu de présentation au CSE", fournie: false },
    ],
  },
  {
    id: "a6",
    titre: "Renouvellement habilitation électrique",
    referentiel: "Obligation de l'établissement",
    responsable: "Camille Dupont",
    echeance: "2026-12-05",
    statut: "a_jour",
    ecart: "Aucun écart — l'habilitation en cours reste valide jusqu'à son échéance.",
    preuves: [{ id: "a6-1", nom: "Attestation d'habilitation", fournie: true, date: "15/11/2025", auteur: "C. Dupont" }],
  },
  {
    id: "a7",
    titre: "Formation gestes et postures",
    referentiel: "CPOM ARS 2025",
    recurrence: "chaque année",
    responsable: "Karim Belkacem",
    echeance: "2026-10-15",
    statut: "a_jour",
    ecart: "Aucun écart — la session de formation a été réalisée et documentée.",
    preuves: [
      { id: "a7-1", nom: "Feuille d'émargement", fournie: true, date: "01/09/2026", auteur: "K. Belkacem" },
      { id: "a7-2", nom: "Attestation organisme de formation", fournie: true, date: "01/09/2026", auteur: "K. Belkacem" },
      { id: "a7-3", nom: "Support pédagogique", fournie: true, date: "01/09/2026", auteur: "K. Belkacem" },
    ],
  },
  {
    id: "a8",
    titre: "Contrôle qualité de l'eau",
    referentiel: "Obligation de l'établissement",
    recurrence: "chaque trimestre",
    responsable: "Karim Belkacem",
    echeance: "2026-11-01",
    statut: "a_jour",
    ecart: "Aucun écart — les résultats d'analyse sont conformes aux seuils réglementaires.",
    preuves: [
      { id: "a8-1", nom: "Résultats d'analyse laboratoire", fournie: true, date: "01/08/2026", auteur: "K. Belkacem" },
      { id: "a8-2", nom: "Registre de suivi", fournie: true, date: "01/08/2026", auteur: "K. Belkacem" },
    ],
  },
];

const STATUT_LABEL: Record<StatutAction, string> = {
  retard: "En retard",
  proche: "Échéance proche",
  a_jour: "À jour",
};

const STATUT_BADGE: Record<StatutAction, string> = {
  retard: "badge-error",
  proche: "badge-warning",
  a_jour: "badge-success",
};

const STATUT_BAR: Record<StatutAction, string> = {
  retard: "bg-error",
  proche: "bg-warning",
  a_jour: "bg-success",
};

function formatEcheance(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function ecartJours(iso: string): number {
  const jour = 24 * 60 * 60 * 1000;
  const echeance = new Date(`${iso}T00:00:00`);
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  return Math.round((echeance.getTime() - aujourdhui.getTime()) / jour);
}

function DelaiEcheance({ iso }: { iso: string }) {
  const jours = ecartJours(iso);
  if (jours < 0) return <span className="text-caption text-error">En retard de {-jours} j</span>;
  return <span className="text-caption text-base-content/60">Dans {jours} j</span>;
}

function nombrePreuvesManquantes(action: Action): number {
  return action.preuves.filter((p) => !p.fournie).length;
}

function IconePreuve({ fournie }: { fournie: boolean }) {
  if (fournie) {
    return (
      <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary text-primary-content shrink-0">
        <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      </span>
    );
  }
  return <span className="inline-block size-5 rounded-full border-2 border-dashed border-warning shrink-0" />;
}

function IconeTrombone() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4.5v6a3 3 0 1 1-6 0v-7a2 2 0 1 1 4 0v6.5a1 1 0 1 1-2 0v-5.5" />
    </svg>
  );
}

function PanneauDetail({ action }: { action: Action }) {
  const manquantes = nombrePreuvesManquantes(action);
  const total = action.preuves.length;
  const fournies = total - manquantes;
  const validable = manquantes === 0;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-(--shadow-raised) p-4 space-y-4 sticky top-6">
      <div className="space-y-2">
        <span className="badge badge-ghost badge-sm">{action.referentiel}</span>
        <h2 className="text-title text-base-content">{action.titre}</h2>
        <p className="text-body text-base-content/70">{action.ecart}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-field border border-base-300 p-3 space-y-1">
          <p className="text-caption text-base-content/60">Responsable</p>
          <p className="text-body font-semibold text-base-content">{action.responsable}</p>
        </div>
        <div className="rounded-field border border-base-300 p-3 space-y-1">
          <p className="text-caption text-base-content/60">Échéance</p>
          <p className="text-body font-semibold font-numeric text-base-content">{formatEcheance(action.echeance)}</p>
          <DelaiEcheance iso={action.echeance} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-body font-semibold text-base-content">Définition de fini</h3>
          <span className="text-caption font-numeric text-base-content/60">
            {fournies}/{total} · {manquantes === 0 ? "aucune manquante" : `${manquantes} manquante${manquantes > 1 ? "s" : ""}`}
          </span>
        </div>
        <p className="text-caption text-base-content/60">Preuves attendues par l'évaluateur pour valider l'action.</p>

        <ul className="space-y-2">
          {action.preuves.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-field border border-base-300 p-3">
              <IconePreuve fournie={p.fournie} />
              <div className="flex-1 min-w-0">
                <p className="text-body text-base-content truncate">{p.nom}</p>
                {p.fournie ? (
                  <p className="text-caption text-base-content/60">
                    Ajouté le {p.date} par {p.auteur}
                  </p>
                ) : (
                  <p className="text-caption text-warning font-medium">Manquante</p>
                )}
              </div>
              {!p.fournie && (
                <button type="button" className="btn btn-outline btn-primary btn-sm gap-1 shrink-0">
                  <IconeTrombone />
                  Joindre
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <button type="button" className="btn btn-block" disabled={!validable}>
          Valider l'action
        </button>
        {!validable && (
          <p className="text-caption text-base-content/60 text-center">
            Disponible quand les {total} preuves sont jointes.
          </p>
        )}
      </div>
    </div>
  );
}

export function Accueil() {
  const prochainesEcheances = [...actions].sort((a, b) => a.echeance.localeCompare(b.echeance));
  const [selectionId, setSelectionId] = useState(prochainesEcheances[0].id);
  const selection = actions.find((a) => a.id === selectionId) ?? prochainesEcheances[0];

  const enRetard = actions.filter((a) => a.statut === "retard").length;
  const echeanceProche = actions.filter((a) => a.statut === "proche").length;
  const aJour = actions.filter((a) => a.statut === "a_jour").length;
  const preuvesManquantes = actions.reduce((total, a) => total + nombrePreuvesManquantes(a), 0);

  const repartition: { statut: StatutAction; valeur: number }[] = [
    { statut: "retard", valeur: enRetard },
    { statut: "proche", valeur: echeanceProche },
    { statut: "a_jour", valeur: aJour },
  ];
  const maxRepartition = Math.max(...repartition.map((r) => r.valeur), 1);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-display text-primary">Accueil</h1>
        <p className="text-body text-base-content">
          Suivi de la conformité et des plans d'action — données de démonstration.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-300 shadow-(--shadow-raised) p-4 space-y-1">
          <p className="text-micro uppercase text-base-content/60">En retard</p>
          <p className="text-metric font-numeric text-error">{enRetard}</p>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-(--shadow-raised) p-4 space-y-1">
          <p className="text-micro uppercase text-base-content/60">Échéance sous 15 jours</p>
          <p className="text-metric font-numeric text-warning">{echeanceProche}</p>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-(--shadow-raised) p-4 space-y-1">
          <p className="text-micro uppercase text-base-content/60">À jour</p>
          <p className="text-metric font-numeric text-success">{aJour}</p>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-(--shadow-raised) p-4 space-y-1">
          <p className="text-micro uppercase text-base-content/60">Preuves manquantes</p>
          <p className="text-metric font-numeric text-info">{preuvesManquantes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-(--shadow-raised) p-4 space-y-3">
            <h2 className="text-title text-base-content">Répartition des actions par statut</h2>
            <div className="space-y-2">
              {repartition.map((r) => (
                <div key={r.statut} className="flex items-center gap-3">
                  <span className="text-caption text-base-content/70 w-40 shrink-0">{STATUT_LABEL[r.statut]}</span>
                  <div className="flex-1 h-6 bg-base-200 rounded-field overflow-hidden">
                    <div
                      className={`h-full rounded-field ${STATUT_BAR[r.statut]}`}
                      style={{ width: `${(r.valeur / maxRepartition) * 100}%` }}
                    />
                  </div>
                  <span className="text-caption font-numeric text-base-content w-6 text-right">{r.valeur}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-(--shadow-raised) p-4 space-y-3">
            <h2 className="text-title text-base-content">Prochaines échéances</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Responsable</th>
                    <th>Échéance</th>
                    <th>Statut</th>
                    <th>Preuves</th>
                  </tr>
                </thead>
                <tbody>
                  {prochainesEcheances.map((a) => {
                    const manquantes = nombrePreuvesManquantes(a);
                    const total = a.preuves.length;
                    const selectionnee = a.id === selectionId;
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectionId(a.id)}
                        className={`cursor-pointer hoverable ${selectionnee ? "bg-primary/10" : ""}`}
                      >
                        <td>
                          <p className="text-body text-base-content">{a.titre}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="badge badge-ghost badge-sm">{a.referentiel}</span>
                            {a.recurrence && <span className="text-caption text-base-content/50">↻ {a.recurrence}</span>}
                          </div>
                        </td>
                        <td className="text-body text-base-content/70">{a.responsable}</td>
                        <td className="text-body font-numeric">
                          {formatEcheance(a.echeance)}
                          <div>
                            <DelaiEcheance iso={a.echeance} />
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-sm ${STATUT_BADGE[a.statut]}`}>{STATUT_LABEL[a.statut]}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <progress
                              className={`progress w-20 ${manquantes === 0 ? "progress-success" : "progress-warning"}`}
                              value={total - manquantes}
                              max={total}
                            />
                            <span className="text-caption font-numeric text-base-content/70">
                              {total - manquantes}/{total}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <PanneauDetail action={selection} />
        </div>
      </div>
    </section>
  );
}
