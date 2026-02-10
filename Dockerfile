FROM node:22.21.1-alpine AS build
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN mkdir /fe-nextjs
WORKDIR /fe-nextjs
COPY . /fe-nextjs/
RUN npm install
RUN npm run build

FROM node:22.21.1-alpine AS production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN mkdir /fe-nextjs
WORKDIR /fe-nextjs

# Copy necessary files from build stage
COPY --from=build /fe-nextjs/.next ./.next
COPY --from=build /fe-nextjs/public ./public
COPY --from=build /fe-nextjs/package*.json ./
COPY --from=build /fe-nextjs/src ./src

# Install production dependencies only
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
