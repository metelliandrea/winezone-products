FROM node:18.2.0

RUN mkdir -p /usr/src/app
COPY ./src /usr/src/app/src
COPY ./package.json /usr/src/app/package.json
COPY ./tsconfig.json /usr/src/app/tsconfig.json
COPY ./tsconfig.build.json /usr/src/app/tsconfig.build.json
COPY ./nest-cli.json /usr/src/app/nest-cli.json
COPY ./yarn.lock /usr/src/app/yarn.lock
WORKDIR /usr/src/app/
RUN yarn
RUN yarn build
RUN rm -rf ./src

# Setting up ENVs
ENV NODE_ENV=development\
  PORT=3000\
  LOGGER_LEVEL=debug\
  #LOGTAIL_TOKEN=J8p4WmRK37xKvH6DYLzsfckc\
  DATABASE_HOST=127.0.0.1\
  DATABASE_NAME=products\
  DATABASE_USER=root\
  #DATABASE_PASSWORD=root\
  RABBITMQ_HOSTNAME=localhost\
  RABBITMQ_PORT=5672\
  RABBITMQ_USERNAME=root\
  #RABBITMQ_PASSWORD=root\
  RABBITMQ_PRODUCTS_QUEUE_NAME=products_queue\
  ADD_PRODUCTS_TO_STOCK_SYMBOL=ADD_TO_STOCK\
  AXIOS_BASE_TIMEOUT=3000\
  AUTH_SERVICE_INTERNAL_URL=localhost\
  AUTH_SERVICE_INTERNAL_PORT=3001

# Seeting up start command
CMD ["yarn", "start", "prod"]