FROM node:16-alpine

WORKDIR /opt/app

ENV NODE_ENV production
ENV NEXT_PUBLIC_API_BASEURL ${API_BASEURL}

COPY . .

RUN npm ci

RUN npm install --dev && npm run build

CMD [ "npm", "start" ]