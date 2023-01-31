FROM node:19.5.0-alpine

WORKDIR /app
COPY . .

RUN npm i

RUN npx browserslist@latest --update-db 
RUN npm run build

CMD npm run dev