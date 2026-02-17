# ---------- Build stage ----------
FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN rm -rf node_modules/.vite && npm run build

# ---------- Runtime stage ----------
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/.output ./.output

USER nodejs

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
