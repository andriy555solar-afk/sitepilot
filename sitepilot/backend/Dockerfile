# =============================================================================
# SitePilot Backend — Multi-stage Dockerfile
# Stage 1: deps      — встановлення залежностей
# Stage 2: builder   — компіляція TypeScript
# Stage 3: development — dev з hot-reload
# Stage 4: production  — мінімальний prod образ
# =============================================================================

FROM node:20-alpine AS deps
WORKDIR /app

# Встановлюємо тільки prod + dev залежності для збірки
COPY package*.json ./
RUN npm ci --frozen-lockfile

# ── Builder ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Development ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS development
WORKDIR /app

RUN apk add --no-cache wget

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3001

# ts-node з hot-reload через nest start --watch
CMD ["npx", "nest", "start", "--watch"]

# ── Production ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache wget dumb-init

# Тільки prod залежності
COPY package*.json ./
RUN npm ci --frozen-lockfile --omit=dev && npm cache clean --force

# Скомпільований код
COPY --from=builder /app/dist ./dist

# Запуск від непривілейованого користувача
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nestjs
USER nestjs

EXPOSE 3001

# dumb-init коректно обробляє SIGTERM для graceful shutdown
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
