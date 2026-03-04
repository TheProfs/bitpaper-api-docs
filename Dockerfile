FROM node:24-slim

WORKDIR /srv/docs

COPY package.json server.js ./
COPY build/ build/

EXPOSE 4567

CMD ["node", "server.js"]
