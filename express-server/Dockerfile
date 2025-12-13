FROM oven/bun:alpine

WORKDIR /app

# Add user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY bun.lock package.json ./
RUN bun install --production

COPY prisma .
RUN bunx prisma generate

COPY . .

CMD ["sh", "-c", "sleep 5 && bunx prisma migrate deploy && bun run index.js"]
