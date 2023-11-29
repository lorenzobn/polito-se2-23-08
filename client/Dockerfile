# Use Node.js v14 as the base image
FROM node:20.8.0

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose port 5173
EXPOSE 5173

# Start the application with the command "npm run dev"
CMD ["npm", "run", "dev"]
