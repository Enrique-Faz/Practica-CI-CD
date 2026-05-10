FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG BUILD_CONFIG=production
RUN npx ng build --configuration=$BUILD_CONFIG

FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/dnd-board-front/browser /usr/share/nginx/html
