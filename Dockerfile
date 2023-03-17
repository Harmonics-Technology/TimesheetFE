FROM node:16-alpine

WORKDIR /opt/app

ENV NODE_ENV production
ENV NEXT_PUBLIC_API_BASEURL ${API_BASEURL}

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn run build

CMD [ "yarn", "start" ]