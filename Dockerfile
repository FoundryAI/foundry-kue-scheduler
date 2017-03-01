# foundryai/foundry-kue-scheduler
FROM node:6.2
MAINTAINER Nick Gerner <nick@foundry.ai>

RUN mkdir -p /app

COPY package.json /app/package.json
RUN cd /app && npm install

COPY . /app/src