#!/usr/bin/env bash

set -euo pipefail

if [ -n "${1:-}" ]; then
  echo "$1"
  exit 0
fi

if [ -n "${DEPLOY_ENV:-}" ]; then
  echo "${DEPLOY_ENV}"
  exit 0
fi

echo "请选择部署环境:" >&2
echo "1) test" >&2
echo "2) pre" >&2
echo "3) prod" >&2
printf "请输入选项 [1-3]: " >&2
read -r env_choice

case "${env_choice}" in
  1)
    echo "test"
    ;;
  2)
    echo "pre"
    ;;
  3)
    echo "prod"
    ;;
  *)
    echo "无效选项: ${env_choice}" >&2
    exit 1
    ;;
esac
