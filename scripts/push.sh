#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# 部署环境：优先使用参数或环境变量；都没有时在终端里选择
DEPLOY_ENV="$(bash "${ROOT_DIR}/scripts/select-env.sh" "${1:-}")"
# 项目名称，会参与生成镜像名和容器名
PROJECT_NAME="${PROJECT_NAME:-lingxi-workbench-front}"
# 服务器公网 IP 或域名，默认直接部署到这台机器
SERVER_HOST="${SERVER_HOST:-120.53.227.126}"
# SSH 端口
SERVER_PORT="${SERVER_PORT:-22}"
# 登录服务器的用户，默认固定为 root，可按需覆盖
SERVER_USER="${SERVER_USER:-root}"

# Docker Hub 用户名，例如: yourname
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-yafenghuang777}"
# 镜像仓库名，默认: 项目名称-环境
IMAGE_NAME="${IMAGE_NAME:-${PROJECT_NAME}-${DEPLOY_ENV}}"
# 镜像标签；部署时建议明确传入时间戳标签
IMAGE_TAG="${IMAGE_TAG:-latest}"
# 完整镜像名；如果你已经手动传了 FULL_IMAGE_NAME，会优先使用你传入的值
FULL_IMAGE_NAME="${FULL_IMAGE_NAME:-${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}}"

# 服务器上运行的容器名称，默认: 项目名称-环境
CONTAINER_NAME="${CONTAINER_NAME:-${PROJECT_NAME}-${DEPLOY_ENV}}"
# 容器内部服务端口，Nuxt 在容器内监听这个端口
APP_PORT="${APP_PORT:-3000}"
# test 环境对外暴露端口
TEST_PUBLIC_PORT="${TEST_PUBLIC_PORT:-8081}"
# pre 环境对外暴露端口
PRE_PUBLIC_PORT="${PRE_PUBLIC_PORT:-8082}"
# prod 环境对外暴露端口
PROD_PUBLIC_PORT="${PROD_PUBLIC_PORT:-80}"
# test 环境 API 地址
TEST_API_BASE="${TEST_API_BASE:-http://120.53.227.126:9999}"
# pre 环境 API 地址
PRE_API_BASE="${PRE_API_BASE:-http://120.53.227.126:9999}"
# prod 环境 API 地址
PROD_API_BASE="${PROD_API_BASE:-http://120.53.227.126:9999}"

case "${DEPLOY_ENV}" in
  prod)
    DEFAULT_API_BASE="${PROD_API_BASE}"
    DEFAULT_PUBLIC_PORT="${PROD_PUBLIC_PORT}"
    ;;
  pre)
    DEFAULT_API_BASE="${PRE_API_BASE}"
    DEFAULT_PUBLIC_PORT="${PRE_PUBLIC_PORT}"
    ;;
  *)
    DEFAULT_API_BASE="${TEST_API_BASE}"
    DEFAULT_PUBLIC_PORT="${TEST_PUBLIC_PORT}"
    ;;
esac

# 前端请求后端 API 的地址；如果没有显式传 NUXT_PUBLIC_API_BASE，就按环境选择
NUXT_PUBLIC_API_BASE="${NUXT_PUBLIC_API_BASE:-${DEFAULT_API_BASE}}"
# 对外暴露端口；如果没有显式传 PUBLIC_PORT，就按环境选择
PUBLIC_PORT="${PUBLIC_PORT:-${DEFAULT_PUBLIC_PORT}}"

REMOTE_SCRIPT=$(cat <<EOF
set -euo pipefail

if docker ps -a --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
  docker rm -f "${CONTAINER_NAME}"
fi

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p ${PUBLIC_PORT}:${APP_PORT} \
  -e HOST=0.0.0.0 \
  -e PORT=${APP_PORT} \
  -e NUXT_PUBLIC_APP_ENV="${DEPLOY_ENV}" \
  -e NUXT_PUBLIC_API_BASE="${NUXT_PUBLIC_API_BASE}" \
  "${FULL_IMAGE_NAME}"
EOF
)

echo "==> Deploying image to ${SERVER_USER}@${SERVER_HOST}:${SERVER_PORT}"
echo "Environment: ${DEPLOY_ENV}"
echo "Container: ${CONTAINER_NAME}"
echo "Image: ${FULL_IMAGE_NAME}"
echo "==> Transferring image to remote server"
docker save "${FULL_IMAGE_NAME}" | ssh -p "${SERVER_PORT}" "${SERVER_USER}@${SERVER_HOST}" "docker load"

echo "==> Starting container on remote server"
ssh -p "${SERVER_PORT}" "${SERVER_USER}@${SERVER_HOST}" "${REMOTE_SCRIPT}"

echo "==> Remote deploy complete"
