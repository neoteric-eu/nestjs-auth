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

### Generate KMS

```bash
aws kms create-key --description dev-threeleaf --region us-east-2
```

Save output somewhere

### Generate System Manager Parameters

This is a bit tricky, so I have created a script for it inside ecs/envs.js, to use it it's enough to execute:

```bash
node ecs/envs.js ENV KMS_KEY_ID
```

Replace ENV with one of the following:

- dev
- stag
- prod

Replace KMS_KEY_ID from prev output.

**FAQ:**

Q: For what sake this is even exists?

A: Basically, you want to pass some variables to the container, by this, you're able to specify them manually in your 
`.env` file, and this script will read them, and put to the System Manager Parameter Store.

### Configure role

Create role

```bash
aws iam --region us-east-1 create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://ecs/task-execution-assume-role.json
```

To create policy to read from AWS System Manager, edit: `ecs/secret-access.json`

- Replace `${REGION}` to your
- Replace `${USER_ID}` to your (HINT: it's a part of AWS_KMS_ARN, by analogy)
- Replace `${AWS_KMS_ARN}` to one from `Generate KMS` 


```bash
aws iam --region us-east-2 create-policy --policy-name ecsTaskAssumePolicy --policy-document file://ecs/secret-access.json
```

Save output for latter usage

Then attach policy to our role:

```bash
aws iam --region us-east-1 attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

And now, attach another policy `ecsTaskAssumePolicy`, that we create, to our role `ecsTaskExecutionRole`

```bash
aws iam --region us-east-2 attach-role-policy --role-name ecsTaskExecutionRole --policy-arn ${POLICY_ARN}
```

Replace `${POLICY_ARN}` to one from above, where we create policy `ecsTaskAssumePolicy`

### Configure ECS

```bash
ecs-cli configure --cluster threeleaf-backend --region us-east-1 --default-launch-type FARGATE --config-name threeleaf-backend
```


### Create a Cluster and Security Group

```bash
ecs-cli up --cluster threeleaf-backend --region us-east-1
```

Replace `VPC_ID` from the previous output 

```bash
aws ec2 create-security-group --group-name "threeleaf-sg" --description "Three Leaf Security Group" --vpc-id "VPC_ID" --region us-east-1
```

replace `security_group_id` from previous output

```bash
aws ec2 authorize-security-group-ingress --group-id "security_group_id" --protocol tcp --port 80 --cidr 0.0.0.0/0 --region us-east-1
```

Then update `ecs/ecs-params.yml` for `subnets` and `security_groups`

### Deploy

```bash
ecs-cli compose --project-name threeleaf-backend service up --create-log-groups --cluster-config threeleaf-backend --timeout 30 --region us-east-2 --force-deployment --target-group-arn ${TARGET_GROUP_ARN} --container-name threeleaf-backend --container-port 80
```

Replace `${TARGET_GROUP_ARN}` with one from newly created Application Load Balancer in AWS Console

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

### DocumentDB port mapping

```bash
ssh -i ~/.ssh/vpc-proxy.pem -L 27017:docdb-2019-03-20-12-30-07.cdujgfmlylru.us-east-2.docdb.amazonaws.com:27017 ubuntu@ec2-18-223-212-127.us-east-2.compute.amazonaws.com -N
```

```bash
mongo --sslAllowInvalidHostnames --ssl --sslCAFile ./ecs/rds-combined-ca-bundle.pem --username caesar --password
``` 
