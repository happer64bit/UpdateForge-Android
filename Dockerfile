# Use the official Node.js image as a base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
RUN apk update && apk add --no-cache git bash

# Install React Native CLI
RUN npm install -g react-native-cli

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Set the environment variable to indicate it's a CI build
ENV CI=true

# Build the React Native project for Android
RUN react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Build the Android APK
RUN cd android && ./gradlew assembleRelease

# Copy the APK to the /app/build folder
RUN cp ./android/app/build/outputs/apk/release/app-release.apk /app/build/app-release.apk

# Cleanup unnecessary files to reduce the image size
RUN rm -rf node_modules && npm cache clean --force

# Expose a volume for the local computer to retrieve the output APK
VOLUME /app/build

# Command to run when the container starts
CMD ["echo", "React Native Docker image built successfully"]
