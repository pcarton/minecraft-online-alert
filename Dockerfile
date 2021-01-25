FROM node:alpine

WORKDIR /app

COPY ./package*.json /app/
COPY ./*.js /app/


RUN mkdir /app/skins
RUN npm ci

ENTRYPOINT [ "node", "/app/server.js" ]