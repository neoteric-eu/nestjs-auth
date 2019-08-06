#!/usr/bin/env bash
cd $(dirname $0)
docker run --rm --env-file ./.env threeleaf-backend:latest
