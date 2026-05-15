# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS app
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM deps AS qa
WORKDIR /app
COPY . .
CMD ["sh", "-c", "npm run typecheck && npm run lint && npm run test && npm run build"]

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:alpine AS preview
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
