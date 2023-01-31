FROM node:19-buster

WORKDIR /app
COPY package*.json ./

RUN npm i

COPY . .
EXPOSE  3000

RUN npm run build
CMD npm run dev