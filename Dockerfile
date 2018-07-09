FROM node:8.11-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --loglevel error

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 1337

CMD [ "npm", "run", "prod" ]
