FROM node:18-alpine3.17 as build

WORKDIR /frontend

COPY frontend .

RUN npm install npm@latest -g
RUN npm install
RUN npm run build

CMD ["npm","run","dev"]