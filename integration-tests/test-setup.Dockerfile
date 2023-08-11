FROM node:lts
ARG SERVICE_URL

WORKDIR /integration-tests

COPY ./package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "test"]

