# Set the base image.
FROM node:alpine


WORKDIR /app

# Install OpenJDK using apk
RUN apk --no-cache add openjdk11

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Remove the existing node_modules folder (if any)
RUN rm -rf node_modules

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .
 
EXPOSE 3000

CMD ["node", "app.js"]