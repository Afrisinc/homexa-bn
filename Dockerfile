FROM node:20-bullseye AS builder

WORKDIR /app

# Enable Corepack and pin Yarn version
RUN corepack enable \
 && corepack prepare yarn@4.12.0 --activate

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --immutable

# Copy source and build
COPY . .
RUN npx prisma generate \
 && yarn build


# =========================
# Runtime
# =========================
FROM node:20-bullseye

WORKDIR /app

# Enable Corepack for runtime commands (docker exec yarn …)
RUN corepack enable \
 && corepack prepare yarn@4.12.0 --activate

COPY --from=builder /app ./

EXPOSE 3004
CMD ["node", "dist/server.js"]
