# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY dist/SistemWeb_LIZVI_FRONT ./dist

# Install a simple HTTP server
RUN npm install -g http-server

# Expose port
EXPOSE 8080

# Start the application
CMD ["http-server", "dist", "-p", "8080", "-c-1", "--proxy", "http://localhost:8080?"]
