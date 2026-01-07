# 1️⃣ Base image
FROM node:20-alpine AS builder

WORKDIR /app

# 2️⃣ Install dependencies
COPY package.json yarn.lock* ./
RUN yarn install

# 3️⃣ Copy code
COPY . .

# 4️⃣ Generate Prisma client
RUN npx prisma generate

# 5️⃣ Build your app (if using TypeScript)
RUN yarn run build

# 6️⃣ Final image
FROM node:20-alpine

WORKDIR /app

# Copy built code and node_modules
COPY --from=builder /app ./

# Expose port
EXPOSE 3004

# Start app
CMD ["node", "dist/server.js"]
