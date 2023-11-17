# Set the base image.
FROM node:10


WORKDIR /app

COPY . .

RUN npm install
RUN npm install cors
 
EXPOSE 3000

CMD ["node", "app.js"]