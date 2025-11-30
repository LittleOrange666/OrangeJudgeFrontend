#!/bin/sh

VARS_TO_SUBST='$BACKEND_LINK'

echo "--- 使用 envsubst 替換 Nginx 配置變數 ---"
echo "BACKEND_LINK: $BACKEND_LINK"

envsubst "$VARS_TO_SUBST" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "--- 替換後的 default.conf 內容 ---"
cat /etc/nginx/conf.d/default.conf
echo "-----------------------------------------"

exec "$@"