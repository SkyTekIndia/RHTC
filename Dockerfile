# syntax=docker/dockerfile:1.6
#
# Single-stage runtime image. The Angular Universal SSR bundle is
# pre-built locally and committed to dist/ — no need to rebuild it here.
# Angular 9 + Node 16 + ARM64 + native deps make in-CI rebuilds slow and
# fragile, so we just consume the artifact and install runtime deps only.

FROM node:16-bullseye-slim

# Chromium for Puppeteer (admit-card / PDF generation at runtime).
# Puppeteer 4.0.1 has no ARM64 prebuilt — skip its download and point it
# at the apt-installed binary.
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROME_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps --omit=dev --no-audit --no-fund

# Pre-built SSR bundle + Express API routes / templates
COPY dist/ ./dist/
COPY server/ ./server/

CMD ["node", "dist/rhtc/server/main.js"]
