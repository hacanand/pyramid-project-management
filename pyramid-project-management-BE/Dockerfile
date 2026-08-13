FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application source
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the API port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
