FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app/frontend
ENV NODE_ENV=production
COPY --from=builder /app/frontend/package*.json ./
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
