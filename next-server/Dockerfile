FROM oven/bun:1

WORKDIR /usr/src/app

COPY bun.lock package.json .
RUN bun install

COPY . .
RUN bun run build

CMD ["bun", "run", "start"]