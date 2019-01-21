# threeleaf-backend
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

## Deployment

[Official documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-cli-tutorial-fargate.html)

Determine if we have a role for ECS

Change region to yours.

### Configure role

```bash
aws iam --region us-east-1 create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://task-execution-assume-role.json
```

Then attach it

```bash
aws iam --region us-east-1 attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### Configure ECS

```bash
ecs-cli configure --cluster threeleaf-backend --region us-east-1 --default-launch-type FARGATE --config-name threeleaf-backend
```


### Create a Cluster and Security Group

```bash
ecs-cli up
```

Replace `VPC_ID` from the previous output 

```bash
aws ec2 create-security-group --group-name "threeleaf-sg" --description "Three Leaf Security Group" --vpc-id "VPC_ID"
```

replace `security_group_id` from previous output

```bash
aws ec2 authorize-security-group-ingress --group-id "security_group_id" --protocol tcp --port 80 --cidr 0.0.0.0/0
```

Then update `ecs-params.yml` for `subnets` and `security_groups`

### Deploy

```bash
ecs-cli compose --project-name threeleaf-backend service up --create-log-groups --cluster-config threeleaf-backend --timeout 30
```


### Check output

```bash
ecs-cli compose --project-name threeleaf-backend service ps --cluster-config threeleaf-backend
```


### View logs

Replace `TASK_ID` with one from previous output

```bash
ecs-cli logs --task-id TASK_ID --follow --cluster-config threeleaf-backend
```

### Scale it up

```bash
ecs-cli compose --project-name threeleaf-backend service scale 2 --cluster-config threeleaf-backend
```


### Destroy it

```bash
ecs-cli compose --project-name threeleaf-backend service down --cluster-config threeleaf-backend
```

```bsh
ecs-cli down --force --cluster-config threeleaf-backend
```
