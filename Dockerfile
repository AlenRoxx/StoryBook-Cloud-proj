# Use a lightweight Node.js image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install --production

# Bundle app source
COPY . .

# Your backend port
EXPOSE 3001

# Start the server
CMD [ "node", "server.js" ]