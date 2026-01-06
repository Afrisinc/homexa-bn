# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files first so corepack can read packageManager
COPY package.json yarn.lock* .yarnrc.yml ./

RUN yarn install

FROM base AS builder
WORKDIR /app

COPY package.json yarn.lock* .yarnrc.yml ./
COPY . .

RUN yarn install
RUN yarn prisma generate
RUN yarn build

FROM base AS runner
WORKDIR /app

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/yarn.lock ./yarn.lock

RUN yarn prisma generate

EXPOSE 3000 3004

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
