# nestjs-auth
Authentication and Authorization example for Nest.js TypeScript Framework
With some boilerplate nice to start your own project, ready to use.

## Requirements

* Nodejs best one from [Node Version Manager](https://github.com/creationix/nvm)
* Docker + Docker Compose
* npm - do not install it using yarn, because it wont work

## Installation

```bash
$ npm install
```

## Configuration

Copy file `.env.example` and name it `.env`

These are environment variables required for application to start.

* `APP_DATABASE_TYPE` is a type of database for `TypeORM`
* `APP_DATABASE_LOGGING` is a logging level for `TypeORM`
* `APP_LOGGER_LEVEL` is a logging level for `Nest.js`

## Running the app

```bash
# Bring up the docker with database
$ docker-compose up -d

# development
$ npm run start

# build
$ npm run build

# production mode
$ npm run prod

# fix lint errors
$ npm run lint:fix
```

## Docker build

### Build image

To build a docker image, execute:

```bash
$ ./build.sh
```

### Run build image

Open docker-compose.yml and remove hashes from beginning of the lines from line nr 13
then run script:

```bash
$ ./run.sh
```
