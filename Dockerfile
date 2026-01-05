# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Enable corepack for yarn support
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies (production only)
RUN yarn install --immutable --production && yarn cache clean

# Build the application
FROM base AS builder
WORKDIR /app

# Copy package files and source code
COPY package.json yarn.lock* ./
COPY . .

# Install all dependencies (including dev dependencies)
RUN yarn install --immutable

# Generate Prisma client
RUN yarn prisma generate

# Build the application
RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy necessary files from previous stages
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/yarn.lock ./yarn.lock

# Generate Prisma client in production
RUN yarn prisma generate

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000 3004

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Start the application
CMD ["node", "dist/server.js"]