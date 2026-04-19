# Next.js Standalone Dockerfile

FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* package-lock.json* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "No lockfile found. Please use pnpm or npm." && exit 1; \
  fi

RUN node -e "require('sharp'); console.log('sharp ok')"

FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "No lockfile found." && exit 1; \
  fi

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PATH="/app/node_modules/.bin:$PATH"

RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/components.json ./components.json
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/app ./app
COPY --from=builder /app/blocks ./blocks
COPY --from=builder /app/collections ./collections
COPY --from=builder /app/components ./components
COPY --from=builder /app/globals ./globals
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/migrations ./migrations
COPY --from=deps /app/node_modules ./node_modules

RUN mkdir .next && chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
