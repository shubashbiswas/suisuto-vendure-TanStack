# =============================================================
# Stage 1: Build the Nitro + TanStack Start bundle
# =============================================================
FROM node:24-trixie-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root monorepo files for workspace resolution
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml* .npmrc* ./
COPY apps/storefront ./apps/storefront

# Install dependencies for storefront
RUN pnpm install --filter storefront... --frozen-lockfile

# Build arguments with sensible defaults (VITE_SITE_URL is required for production builds)
ARG VITE_SITE_URL=http://localhost:3001
ARG VITE_SITE_NAME="Suisuto Store"
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_SITE_NAME=$VITE_SITE_NAME
ENV NODE_ENV=production

# Compile i18n & build standalone Nitro output (.output/)
RUN pnpm --filter storefront build

# =============================================================
# Stage 2: Ultra-lightweight Production Runtime (~100-120MB)
# =============================================================
FROM node:24-trixie-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Non-root user for container security
USER node

# Copy only the compiled standalone Nitro bundle — zero node_modules needed!
COPY --chown=node:node --from=builder /app/apps/storefront/.output ./.output

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
