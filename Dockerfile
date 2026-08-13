FROM node:20-alpine

# Install pm2 globally
RUN npm install -g pm2

WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed for Next.js.
RUN apk add --no-cache libc6-compat

# We need to copy everything to build both projects
COPY . .

# Build the backend
WORKDIR /app/pyramid-project-management-BE
RUN npm install
RUN npm run build

# Build the frontend
WORKDIR /app/pyramid-project-management-FE
RUN npm install
RUN npm run build

# Go back to root
WORKDIR /app

# Expose both ports
EXPOSE 8000
EXPOSE 8001

# Start pm2 with ecosystem.config.js
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
