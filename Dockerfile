FROM node:11-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --loglevel error

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 1337

USER node

CMD [ "npm", "run", "prod" ]
