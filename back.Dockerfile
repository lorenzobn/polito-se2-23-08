FROM node:14

WORKDIR /backend

COPY backend/package.json .

RUN npm install -g nodemon
RUN npm install

COPY backend .

CMD ["nodemon", "backend/app.mjs"]