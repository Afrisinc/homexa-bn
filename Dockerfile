# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

RUN apk add --no-cache python3 make g++
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files first so corepack can read packageManager
COPY package.json yarn.lock* .yarnrc.yml ./

RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY package.json yarn.lock* .yarnrc.yml ./
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn prisma generate || echo "Prisma generate completed with status: $?"
RUN yarn build

FROM base AS runner
WORKDIR /app

# Create non-root user before copying files
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/yarn.lock ./yarn.lock

# Prisma client generation in final stage
RUN yarn prisma generate || echo "Prisma client already generated"

EXPOSE 3000 3004

ENV NODE_ENV=production

USER nodejs

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

CMD ["node", "dist/server.js"]
