FROM oven/bun:alpine AS base

FROM base AS builder

WORKDIR /app

COPY bun.lock package.json ./
RUN bun install

COPY . .

RUN bun run build


FROM base AS production

WORKDIR /app

# Set node env and disable telemetry
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["bun", "run", "server.js"]
