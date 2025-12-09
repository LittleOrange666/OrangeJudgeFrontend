#!/bin/bash
npm run build
docker compose -f tools/docker-compose-test.yml up -d
docker compose -f tools/docker-compose-test.yml restart