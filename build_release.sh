#!/bin/bash
#
# OrangeJudge, a competitive programming platform
#
# Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#

if [ -z $1 ]; then
  echo "version is required for the release build"
  echo "Usage: $0 <version>"
else
  echo "Building version $1"
  docker build . -t littleorange666/judge_frontend:$1 || exit 1
  echo "Pushing version $1"
  docker push littleorange666/judge_frontend:$1
  echo "Building latest"
  docker build . -t littleorange666/judge_frontend:latest || exit 1
  echo "Pushing latest"
  docker push littleorange666/judge_frontend:latest
fi