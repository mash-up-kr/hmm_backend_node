FROM node:16.13.2-alpine3.14 AS builder
WORKDIR /home/node/app

COPY . .
RUN npm --global install pnpm@6.32.10
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:16.13.2-alpine3.14
WORKDIR /home/node/app

COPY --from=builder /home/node/app/dist ./dist
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm --global install pnpm@6.32.10
RUN pnpm add --global pm2
RUN pnpm install --frozen-lockfile --prod

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]