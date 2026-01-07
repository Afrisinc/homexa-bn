FROM node:20-alpine AS builder

WORKDIR /app

# Enable Corepack so Yarn 4 works
RUN corepack enable

# Copy dependencies
COPY package.json yarn.lock* ./

# Install dependencies using Yarn 4
RUN yarn install

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app (if TypeScript)
RUN yarn build

# Final image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3004
CMD ["node", "dist/server.js"]
