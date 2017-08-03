FROM node

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src
COPY package.json /usr/src
RUN yarn install && yarn cache clean --force
ENV PATH /usr/src/node_modules/.bin:$PATH
ENV NPM_CONFIG_PREFIX /usr/src/node_modules

WORKDIR /usr/src/app
COPY . /usr/src/app

CMD ["yarn", "test"]
