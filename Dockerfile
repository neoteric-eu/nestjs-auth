## The builder

FROM node:11-alpine as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --loglevel error

COPY . .

RUN npm run build


## The cleaner

FROM node:11-alpine as cleaner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

RUN npm prune --production


## Output image

FROM node:11-alpine

LABEL maintainer="Przemysław Czekaj <pczekaj@neoteric.eu>"

HEALTHCHECK CMD curl -f http://localhost/healthcheck || exit 1

RUN apk add --update curl

WORKDIR /usr/src/app

COPY --from=cleaner /usr/src/app .

EXPOSE 1337

USER node

CMD [ "npm", "run", "prod" ]
