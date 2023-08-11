FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN \
  npm ci && \
  npm run build

RUN \
  apk add --update --virtual useradd-dep shadow && \
  groupadd -g 101 appuser && \
  useradd -r -u 101 -g appuser appuser && \
  apk del useradd-dep

USER appuser

EXPOSE 8000

CMD ["node", "dist/server.js"]
