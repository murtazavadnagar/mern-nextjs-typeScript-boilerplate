FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci
COPY backend ./backend
WORKDIR /app/backend
RUN npm run build

FROM node:22-alpine
WORKDIR /app/backend
COPY --from=builder /app/backend/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/backend/dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
