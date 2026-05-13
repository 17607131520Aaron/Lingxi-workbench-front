#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 部署环境：优先使用参数或环境变量；都没有时在终端里选择
DEPLOY_ENV="$(bash "${ROOT_DIR}/select-env.sh" "${1:-}")"
# 项目名称，会参与生成镜像名
PROJECT_NAME="${PROJECT_NAME:-lingxi-workbench-front}"
# Docker Hub 用户名，例如: yourname
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-yafenghuang777}"
# 镜像仓库名，默认: 项目名称-环境
IMAGE_NAME="${IMAGE_NAME:-${PROJECT_NAME}-${DEPLOY_ENV}}"
# 时间戳标签，默认当前时间，格式: YYYYMMDDHHMMSS
IMAGE_TAG="${IMAGE_TAG:-$(date '+%Y%m%d%H%M%S')}"
# 完整镜像名，格式: 用户名/项目名称-环境:时间戳
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "==> Step 1/4: build image"
DEPLOY_ENV="${DEPLOY_ENV}" \
PROJECT_NAME="${PROJECT_NAME}" \
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME}" \
IMAGE_NAME="${IMAGE_NAME}" \
IMAGE_TAG="${IMAGE_TAG}" \
FULL_IMAGE_NAME="${FULL_IMAGE_NAME}" \
"${ROOT_DIR}/build.sh" "${DEPLOY_ENV}"

echo "==> Step 2/4: verify local image exists"
docker image inspect "${FULL_IMAGE_NAME}" >/dev/null

echo "==> Step 3/4: prepare image for remote deploy"
echo "Local image is ready: ${FULL_IMAGE_NAME}"

echo "==> Step 4/4: deploy to remote server"
DEPLOY_ENV="${DEPLOY_ENV}" \
PROJECT_NAME="${PROJECT_NAME}" \
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME}" \
IMAGE_NAME="${IMAGE_NAME}" \
IMAGE_TAG="${IMAGE_TAG}" \
FULL_IMAGE_NAME="${FULL_IMAGE_NAME}" \
"${ROOT_DIR}/push.sh" "${DEPLOY_ENV}"

echo "==> All done"
