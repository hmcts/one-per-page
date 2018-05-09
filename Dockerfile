FROM node:9.11.1

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /usr/src/app &&\
  echo "--modules-folder /usr/src/node_modules" > /root/.yarnrc
ENV NPM_CONFIG_PREFIX /usr/src/node_modules
ENV PATH /usr/src/node_modules/.bin:$PATH
COPY package.json /usr/src
COPY yarn.lock /usr/src
WORKDIR /usr/src

RUN yarn install && yarn cache clean --force

COPY . /usr/src/app

RUN cp package.json /usr/src/app && cp yarn.lock /usr/src/app
WORKDIR /usr/src/app

CMD ["yarn", "test"]
