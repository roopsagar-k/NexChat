FROM node:24.9.0-alpine AS build

WORKDIR /app


COPY . .
RUN npm install
RUN npm run build

FROM node:24.9.0-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build ./app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/server.js" ]
