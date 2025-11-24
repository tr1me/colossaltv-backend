# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of your app
COPY . .

# Expose the port your server.js listens on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
