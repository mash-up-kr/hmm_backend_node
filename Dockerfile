FROM node:16.5-alpine AS builder
WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:16.5-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]