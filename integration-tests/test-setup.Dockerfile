FROM node:lts-alpine

WORKDIR /integration-tests

COPY ./package*.json ./

RUN npm ci

RUN apk --no-cache add curl

COPY . .

CMD ["npm", "run", "test"]

