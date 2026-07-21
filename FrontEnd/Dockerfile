FROM node:24-alpine AS compilacion

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.28-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=compilacion /app/dist/ /usr/share/nginx/html/

RUN mkdir -p /srv/django/static /srv/django/media

EXPOSE 80
