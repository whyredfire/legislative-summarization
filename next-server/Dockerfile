FROM oven/bun:alpine AS base

FROM base AS build

WORKDIR /usr/src/app

COPY bun.lock package.json .
RUN bun install

COPY . .

RUN bun run build

FROM base AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.next/standalone .
COPY --from=build /usr/src/app/.next/static .next/static

CMD ["bun", "run", "server.js"]
