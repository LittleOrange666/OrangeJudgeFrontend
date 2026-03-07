#!/bin/sh

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

export BACKEND_LINK="${BACKEND_LINK:-http://judge_backend:8080}"

export WORKER_PROCESSES="${WORKER_PROCESSES:-4}"

VARS_TO_SUBST='$BACKEND_LINK $WORKER_PROCESSES'

echo "--- 使用 envsubst 替換 Nginx 配置變數 ---"
echo "BACKEND_LINK: $BACKEND_LINK"
echo "WORKER_PROCESSES: $WORKER_PROCESSES"

envsubst "$VARS_TO_SUBST" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

envsubst "$VARS_TO_SUBST" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "--- 替換後的 nginx.conf 內容 ---"
cat /etc/nginx/nginx.conf
echo "-----------------------------------------"

echo "--- 替換後的 default.conf 內容 ---"
cat /etc/nginx/conf.d/default.conf
echo "-----------------------------------------"

exec "$@"