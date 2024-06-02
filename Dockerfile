FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN ls -al

RUN corepack enable

RUN yarn set version stable

RUN yarn -v

RUN yarn

RUN yarn buildall

RUN rm -rf /usr/src/app/core/src
RUN rm -rf /usr/src/app/models/src
RUN rm -rf /usr/src/app/http/src

CMD ["yarn", "start"]
