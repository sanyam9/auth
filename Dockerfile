FROM node

COPY package*.json /app

WORKDIR /app

RUN npm install

COPY . /app

ENTRYPOINT [ "npm", "start" ]