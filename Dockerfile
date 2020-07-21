FROM node:13-alpine


RUN mkdir -p /app
ADD . /app
WORKDIR /app

RUN npm install

CMD npm run start