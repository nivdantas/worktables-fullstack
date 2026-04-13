# syntax=docker/dockerfile:1.7

############################
# Base image for all stages
############################
FROM oven/bun:1.3.11 AS base
WORKDIR /app

############################
# Dependencies layer
############################
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/ts-config/package.json packages/ts-config/package.json
RUN bun install --frozen-lockfile

############################
# Source layer
############################
FROM deps AS source
COPY . .

##########################################
# Web target (Next.js app on port 3000)
##########################################
FROM source AS web
WORKDIR /app/apps/web
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start", "--hostname", "0.0.0.0", "--port", "3000"]

##########################################
# API target (Express app on port 3001)
##########################################
FROM source AS api
WORKDIR /app/apps/api
EXPOSE 3001
CMD ["bun", "run", "start"]
