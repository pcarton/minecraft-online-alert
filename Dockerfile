FROM node:alpine

WORKDIR /app

COPY ./package*.json /app/
COPY ./*.js /app/
COPY ./express /app/express


RUN mkdir /app/skins
RUN mkdir /app/skins/faces
RUN mkdir /etc/app-certs
RUN npm ci

ENTRYPOINT [ "node", "/app/server.js" ]