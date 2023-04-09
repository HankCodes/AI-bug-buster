FROM node:14-alpine

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

COPY pull-repository.sh ./
RUN chmod +x pull-repository.sh

ENTRYPOINT ["sh", "-c", "./pull-repository.sh && npm start"]
