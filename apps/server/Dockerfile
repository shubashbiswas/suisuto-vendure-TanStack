# =============================================================
# Stage 1: Build Vendure Backend (Server + Worker + Dashboard)
# =============================================================
FROM node:24-trixie-slim AS builder

WORKDIR /app

# Install native dependencies required by sharp, bcrypt, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo workspace files for dependency resolution
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml* .npmrc* ./
COPY apps/packages ./apps/packages
COPY apps/server/package.json ./apps/server/

# Install dependencies needed to build server and workspace packages
RUN pnpm install --filter server... --frozen-lockfile

# Copy server source code and configuration
COPY apps/server ./apps/server

# Build plugin packages, dashboard (vite), server (tsc), and worker (tsc)
RUN pnpm --filter @suisuto/vendure-geoip-plugin build && \
    pnpm --filter @suisuto/vendure-multi-hub-plugin build && \
    pnpm --filter @suisuto/vendure-multi-market-plugin build && \
    pnpm --filter server build

# =============================================================
# Stage 2: Production Runtime
# =============================================================
FROM node:24-trixie-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Ensure Node module resolution can locate hoisted and workspace dependencies across all sub-packages
ENV NODE_PATH=/app/apps/server/node_modules:/app/node_modules

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace and lock files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml* .npmrc* ./
COPY apps/server/package.json ./apps/server/

# Copy compiled plugin packages from builder
COPY --from=builder /app/apps/packages ./apps/packages

# Install only production dependencies for server and clean pnpm cache
RUN pnpm install --prod --filter server... --frozen-lockfile && \
    rm -rf /root/.local/share/pnpm/store /root/.cache

# Copy compiled artifacts from builder
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/static ./apps/server/static

WORKDIR /app/apps/server

# Expose Vendure API & Dashboard port
EXPOSE 3000

CMD ["node", "dist/index.js"]
