FROM node:22-alpine AS build

ARG DATABASE_URL

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .

ENV DATABASE_URL=${DATABASE_URL}

RUN pnpm exec prisma generate

RUN pnpm run build


FROM node:22-alpine

RUN npm install -g pnpm prisma@6.8.2

WORKDIR /app

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/dist ./dist

RUN pnpm install --frozen-lockfile --prod

RUN pnpm exec prisma generate

ENV PORT=3000

EXPOSE ${PORT}

CMD ["node", "dist/main"]