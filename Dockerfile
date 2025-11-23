# ESTÁGIO 1: Base
FROM node:20-alpine As base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# ESTÁGIO 2: Development
FROM base As development
COPY . .
CMD ["npm", "run", "start:dev"]

# ESTÁGIO 3: Build
FROM base As build
COPY . .
RUN npm run build

# ESTÁGIO 4: Production
FROM node:20-alpine As production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app/dist ./dist
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]
