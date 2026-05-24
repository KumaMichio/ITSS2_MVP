FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache openssl netcat-openbsd

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "echo 'Waiting for DB TCP...' && until nc -z db 5432; do sleep 2; done && echo 'DB port open, pushing schema...' && npx prisma db push && echo 'Seeding...' && npm run db:seed && echo 'Starting server...' && node dist/index.js"]
