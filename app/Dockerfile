# Development
FROM node:alpine as dev

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

# Build
FROM node:alpine as build

WORKDIR /app
COPY . .
RUN npm install

CMD ["npm", "run", "build"]

# Production
FROM node:alpine as prod

WORKDIR /app
COPY --from=build /app/build /app/build
COPY src /app/src
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install --production

CMD ["node", "-r", "dotenv/config", "build"]
