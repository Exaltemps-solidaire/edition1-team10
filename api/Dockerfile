# Single-stage runtime image (CCOE-RULES §3.1) — la préparation (bun install)
# se fait explicitement en CI (.gitlab-ci.yml), pas ici.
FROM docker.io/oven/bun:alpine
WORKDIR /app
COPY package.json bun.lock ./
COPY node_modules/ ./node_modules/
COPY src/ ./src/
USER bun
CMD ["bun", "src/index.ts"]
