#!/bin/bash
npm run build
docker compose -f tools/docker-compose-test.yml restart