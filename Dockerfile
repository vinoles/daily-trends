# Use an official Node.js image based on Debian
FROM node:18

# Set an environment variable to skip the automatic Chromium download by Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install necessary dependencies, including Google Chrome
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

# Add the Google Chrome repository
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for the executables of Chromium and Google Chrome
ENV GOOGLE_CHROME_BIN=/usr/bin/google-chrome

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
