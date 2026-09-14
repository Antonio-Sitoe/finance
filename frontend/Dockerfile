# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG API_URL=/api
ENV API_URL=${API_URL}
# Substitui a URL da API no environment de produção antes do build (literal, sem regex)
RUN node <<'NODE' && npm run build
const fs = require('fs');
const apiUrl = process.env.API_URL || '/api';
fs.writeFileSync(
  'src/environments/environment.prod.ts',
  `export const environment = {
  production: true,
  /** Com nginx a fazer proxy de /api → backend. Override no build se a API for noutro host. */
  apiUrl: ${JSON.stringify(apiUrl)},
}
`
);
NODE

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ng-tailadmin/browser /usr/share/nginx/html
EXPOSE 80
