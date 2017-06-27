FROM node:8-alpine
MAINTAINER dtodt

ADD package.json /

RUN apk add --no-cache make gcc g++ python && \
  npm install --production --silent && \
  apk del make gcc g++ python