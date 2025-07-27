FROM oven/bun:slim

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY bun.lock package.json .
RUN bun install --production

COPY prisma .
RUN bunx prisma generate

COPY . .

CMD ["sh", "-c", "sleep 5 && bunx prisma migrate deploy && bun run index.js"]

