FROM node:14-alpine

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

RUN apk update && apk add --no-cache git
RUN git config --global user.email "bot@.com"
RUN git config --global user.name "Bot"

COPY clone-repository.sh ./
RUN chmod +x clone-repository.sh

ENTRYPOINT ["sh", "-c", "./clone-repository.sh && npm start"]
