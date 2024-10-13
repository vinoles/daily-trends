# Use an official Node.js 22 image based on Debian
FROM node:22

# Set an environment variable to skip the automatic Chromium download by Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install necessary dependencies, including Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg2 \
    curl \
    ca-certificates \
    fonts-liberation \
    libxss1 \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxi6 \
    libxrandr2 \
    libxshmfence1 \
    xdg-utils \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Download and install Google Chrome manually
RUN curl -fsSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o google-chrome.deb \
    && apt-get update \
    && apt-get install -y ./google-chrome.deb \
    && rm google-chrome.deb \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for the executables of Chromium and Google Chrome
ENV GOOGLE_CHROME_BIN=/usr/bin/google-chrome

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Create the application directory
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install Node.js packages defined in package.json
RUN npm install

# Copy all application files to the working directory
COPY . .

# Compile the application
RUN npm run build

# Default command to run the application
CMD ["npm", "run", "start:prod"]
