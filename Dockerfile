# base image
FROM node:alpine


# create &amp; set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
RUN yarn 

# start app
RUN yarn build
EXPOSE 3000
CMD yarn start

ENV NODE_ENV production
ENV NEXT_PUBLIC_API_BASEURL ${API_BASEURL}

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

CMD [ "yarn", "start" ]

