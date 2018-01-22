FROM node

MAINTAINER Andriy Shepitsen

RUN npm i -g yarn

RUN yarn

RUN yarn build

RUN node server.js


