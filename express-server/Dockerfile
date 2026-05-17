FROM oven/bun:alpine

WORKDIR /app

# Add non-root user
RUN adduser -D -u 1001 expressjs

COPY --chown=expressjs:expressjs bun.lock package.json ./
RUN bun install --production

COPY --chown=expressjs:expressjs prisma .
RUN bunx prisma generate

COPY --chown=expressjs:expressjs . .

RUN mkdir -p uploads && chown expressjs:expressjs uploads

USER expressjs

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run index.js"]
