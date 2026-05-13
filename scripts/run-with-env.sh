#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 [test|pre|prod] <command> [args...]"
  exit 1
fi

if [ "$#" -ge 2 ] && [[ "$1" =~ ^(test|pre|prod)$ ]]; then
  DEPLOY_ENV="$1"
  shift
else
  DEPLOY_ENV="$(bash "${ROOT_DIR}/scripts/select-env.sh")"
fi

if [ "$#" -lt 1 ]; then
  echo "缺少要执行的命令"
  exit 1
fi

ENV_FILE="${ROOT_DIR}/.env.${DEPLOY_ENV}"

if [ ! -f "${ENV_FILE}" ]; then
  echo "Environment file not found: ${ENV_FILE}"
  exit 1
fi

set -a
source "${ENV_FILE}"
set +a

exec "$@"
