# build stage

FROM node:latest AS build

WORKDIR /app

ARG VITE_BASE_URL
ARG VITE_SOCKET_URL

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# production stage

FROM nginx:stable-alpine AS production

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY nginxDefault.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]