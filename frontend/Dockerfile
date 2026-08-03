FROM node:20-alpine AS base
WORKDIR /app

FROM base AS development
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000

FROM base AS build
COPY package*.json .
RUN npm ci --only=production
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
