FROM node:current-buster-slim

WORKDIR /app
COPY package*.json ./

COPY . .
RUN rm -rf node_modules
RUN npm i

EXPOSE 3000
RUN npm run build
CMD npm run start