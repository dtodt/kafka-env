FROM node:8-slim
MAINTAINER dtodt

ADD . .

RUN  apt-get update -qqy \
  && apt-get install -y --no-install-recommends \
     build-essential \
     liblz4-dev \
     libpthread-stubs0-dev \
     libsasl2-dev \
     libsasl2-modules \
     libssl-dev \
     make \
     python \
  && rm -rf /var/cache/apt/* /var/lib/apt/lists/* \
  && npm install --production --silent