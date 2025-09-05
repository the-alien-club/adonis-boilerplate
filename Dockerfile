# Note that this file, if in a monorepo, only works with a context
# at the source of the monorepo and is not intended to be used
# in a standalone manner.

# Args
ARG PORT=3333

# Using Node.js 24 as the base image
FROM node:24-alpine AS base

# All dependencies stage
FROM base AS deps
WORKDIR /app
COPY ./package.json ./yarn.lock ./
COPY ./packages/backend/package.json ./packages/backend/
RUN yarn install --non-interactive

# Production only dependencies stage
FROM base AS production-deps
WORKDIR /app
COPY ./package.json ./yarn.lock ./
COPY ./packages/backend/package.json ./packages/backend/
RUN yarn install --non-interactive --production

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./packages/backend/ ./packages/backend/
WORKDIR /app/packages/backend
RUN yarn build

# Production stage
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/packages/backend/build ./

EXPOSE ${PORT}
CMD ["node", "./bin/server.js"]
