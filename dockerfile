# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install --legacy-peer-deps



# Copy the rest of the application files

COPY . . 
COPY .env .

# 2. Generate Prisma Client before build
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 4001

# Command to run the application
CMD ["node", "dist/main"]