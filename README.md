# sauvegarde-conformite

## Overview

Suivi de la conformité et des plans d'action pour l'association La
Sauvegarde du Nord. Pour les chefs de service et directeurs d'établissement :
voir en un coup d'œil ce qu'il reste à faire, quelles preuves manquent avant
un contrôle, et ne pas laisser expirer une action périodique. Cf.
`/srv/team10/passation/PASSATION.md` pour le cadrage complet.

## Getting started

```bash
chmod +x bootstrap.sh && APP=sauvegarde-conformite ./bootstrap.sh
gitlab-ci-local --force-shell-executor        # ACTION=start|stop|purge
```

Pour l'instant : aucun seed, aucune donnée — le scaffold ne pose que la
structure (frontend + api) et 4 pages vides. `GET /health` est le seul
point d'API exposé.

## Design vocabulary

Le thème `core` par défaut (§7.5) — daisyUI + `core-platform/core-platform/templates/core.theme.css`,
copié dans `frontend/src/core.theme.css`. Aucun composant hors du kit
daisyUI pour l'instant.

## Code language

fr — le domaine métier (plan d'action, preuve, échéance, alerte) est
français, cohérent avec le dossier de passation.

## Tested critical paths

None — aucun test pour l'instant, le scaffold ne contient aucune logique
métier.

## Performance

None.

## Personal data register

None — l'app ne stocke encore aucune donnée.

## External data sources

None.

## Exposed interfaces

REST — `GET /health` uniquement pour l'instant (hors `/api/v1`, convention
de santé). Les futures ressources métier suivront `/api/v1/...` (§17.1).

## LLM FinOps

None.

## Durable workflows

None.

## Libraries outside the recommendations

None — le stack suit les recommandations par défaut (§8), sauf les deux
choix documentés ci-dessous parmi les alternatives déjà tolérées par les
guidelines.

## Structuring decisions

- **Pas de service `worker`** : la structure canonique CCoE en compte trois
  (frontend/api/worker), mais rien dans le backlog actuel (plan d'action,
  détail d'une action, alertes récurrentes) ne dépasse le seuil de 350 ms
  qui imposerait un traitement asynchrone (§4.2). Ajouté dès qu'un besoin
  réel apparaît (§15.2 — pas d'abstraction spéculative).
- **Routing frontend : React Router**, plutôt que TanStack Router
  (recommandation par défaut mais explicitement tolérée, §8.4) : 4 routes
  fixes, le typage/codegen de TanStack Router n'apporte rien ici.
- **API : Hono**, plutôt que Fastify (§8.1) : 100 % Bun-natif et minimal.
  Fastify est recommandé notamment pour ses plugins CORS — mais la machine
  du hackathon sert front et API sur la même origine via son proxy d'entrée
  (`/srv/team10/CLAUDE.md` §2), donc aucun CORS à gérer.
- **Assets et magasin d'objets** : par contrainte machine
  (`/srv/team10/CLAUDE.md` §3), aucun accès direct au magasin d'objets
  depuis le navigateur — la CSP du frontend (`nginx.conf`) ne référence donc
  que `'self'`, pas d'origine `:9000`. Les futurs assets passeront par une
  route de l'API.

## CCoE waivers

None.
