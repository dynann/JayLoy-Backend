FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies with more verbose output and error handling
RUN npm ci --verbose || (echo "npm ci failed, trying with legacy peer deps" && npm ci --legacy-peer-deps)

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application with migration
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
