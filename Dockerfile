# Build stage
FROM node:22.21.1-alpine AS builder

ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install all dependencies including dev dependencies for building
RUN npm ci

# Copy source code (includes .env for NEXT_PUBLIC_* vars needed at build time)
COPY . .

# Build Next.js application with production NODE_ENV
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:22.21.1-alpine AS runner

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
