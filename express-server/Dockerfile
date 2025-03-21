FROM oven/bun

WORKDIR /usr/src/app

COPY bun.lock package.json .
RUN bun install

COPY prisma .
RUN bunx prisma generate

COPY . .

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run index.js"]