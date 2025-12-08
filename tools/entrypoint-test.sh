#!/bin/sh

export BACKEND_LINK="${BACKEND_LINK:-http://judge_backend:8080}"

export WORKER_PROCESSES="${WORKER_PROCESSES:-4}"

VARS_TO_SUBST='$BACKEND_LINK $WORKER_PROCESSES'

echo "--- 使用 envsubst 替換 Nginx 配置變數 ---"
echo "BACKEND_LINK: $BACKEND_LINK"
echo "WORKER_PROCESSES: $WORKER_PROCESSES"

envsubst "$VARS_TO_SUBST" < /tools/default.conf > /etc/nginx/conf.d/default.conf

envsubst "$VARS_TO_SUBST" < /tools/nginx.conf > /etc/nginx/nginx.conf

echo "--- 替換後的 nginx.conf 內容 ---"
cat /etc/nginx/nginx.conf
echo "-----------------------------------------"

echo "--- 替換後的 default.conf 內容 ---"
cat /etc/nginx/conf.d/default.conf
echo "-----------------------------------------"

echo "--- 啟動 Nginx ---"
exec nginx -g 'daemon off;'
