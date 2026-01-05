# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files first so corepack can read packageManager
COPY package.json yarn.lock* ./

RUN yarn install --immutable --production && yarn cache clean

FROM base AS builder
WORKDIR /app

COPY package.json yarn.lock* ./
COPY . .

RUN yarn install --immutable
RUN yarn prisma generate
RUN yarn build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/yarn.lock ./yarn.lock

RUN yarn prisma generate

USER nodejs

EXPOSE 3000 3004

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

CMD ["node", "dist/server.js"]