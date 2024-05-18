FROM node:20

COPY . /app

WORKDIR /app

RUN yarn

RUN rm -rf /app/core/src
RUN rm -rf /app/models/src
RUN rm -rf /app/http/src

CMD ["yarn", "start"]
