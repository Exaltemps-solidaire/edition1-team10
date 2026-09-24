# Single-stage runtime image (CCOE-RULES §3.1) — `bun run build` (vite build)
# se fait explicitement en CI (.gitlab-ci.yml), pas ici.
FROM docker.io/library/nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
