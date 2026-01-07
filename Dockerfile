FROM node:20-bullseye AS builder

WORKDIR /app


# Install OpenSSL 1.1
RUN apt-get update && apt-get install -y libssl1.1 bash

# Enable Corepack so Yarn 4 works
RUN corepack enable

# Copy dependencies
COPY package.json yarn.lock* ./

# Install dependencies using Yarn 4
RUN yarn install

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npm install -g prisma@5.22.0 @prisma/client@5.22.0
RUN npx prisma generate

# Build app (if TypeScript)
RUN yarn build


# Final image
FROM node:20-bullseye
WORKDIR /app
RUN apt-get update && apt-get install -y libssl1.1 bash
COPY --from=builder /app ./
EXPOSE 3004
CMD ["node", "dist/server.js"]
