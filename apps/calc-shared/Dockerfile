FROM node:8-slim
MAINTAINER dtodt

ADD . .

RUN apt-get update \
    && apt-get install -y build-essential python \
    && npm install --production --silent \
    && apt-get purge -y build-essential python \
    && apt-get autoremove -y && apt-get autoclean -y \
    && rm -rf /var/lib/apt/lists/*
