FROM node:current-buster-slim

WORKDIR /app
COPY package*.json ./

RUN npm i

COPY . .
EXPOSE  3000

RUN npm run build
CMD npm run start