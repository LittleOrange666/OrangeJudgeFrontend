#!/bin/bash
if [ -z $1 ]; then
  echo "version is required for the release build"
  echo "Usage: $0 <version>"
else
  echo "Building version $1"
  docker build . -t littleorange666/judge_frontend:$1 | exit 1
  echo "Pushing version $1"
  docker push littleorange666/judge_frontend:$1
  echo "Building latest"
  docker build . -t littleorange666/judge_frontend:latest | exit 1
  echo "Pushing latest"
  docker push littleorange666/judge_frontend:latest
fi