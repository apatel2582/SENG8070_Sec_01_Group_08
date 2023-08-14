FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY start-migrate.sh /start-migrate.sh

# Install the application dependencies
RUN npm ci

# Copy the rest of the application to the container
COPY . .

# Build the TypeScript application
RUN npm run build

RUN \
  apk add --update --virtual useradd-dep shadow && \
  groupadd -g 101 appuser && \
  useradd -r -u 101 -g appuser appuser && \
  apk del useradd-dep

RUN mkdir -p /home/appuser && chown -R appuser:appuser /home/appuser

USER appuser

EXPOSE 8000

CMD ["node", "dist/server.js"]
