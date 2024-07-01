# Use a lightweight Node.js image
FROM node:21.7.3

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the entire project
COPY . .

# Build TypeScript
RUN yarn run build

# Expose port 8886
EXPOSE 8886

# Start the API server
CMD ["node", "public/app.js"]