#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 部署环境：优先使用参数或环境变量；都没有时在终端里选择
DEPLOY_ENV="$(bash "${ROOT_DIR}/scripts/select-env.sh" "${1:-}")"
# 项目名称，会参与生成镜像名
PROJECT_NAME="${PROJECT_NAME:-lingxi-workbench-front}"
# Docker Hub 用户名，例如: yourname
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-yafenghuang777}"
# 镜像仓库名，默认: 项目名称-环境
IMAGE_NAME="${IMAGE_NAME:-${PROJECT_NAME}-${DEPLOY_ENV}}"
# 时间戳标签，默认当前时间，格式: YYYYMMDDHHMMSS
IMAGE_TAG="${IMAGE_TAG:-$(date '+%Y%m%d%H%M%S')}"
# 完整镜像名，格式: 用户名/项目名称-环境:时间戳
FULL_IMAGE_NAME="${FULL_IMAGE_NAME:-${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}}"
# 构建平台，默认构建 linux/amd64 镜像
PLATFORM="${PLATFORM:-linux/amd64}"

echo "==> Building image: ${FULL_IMAGE_NAME}"
echo "Environment: ${DEPLOY_ENV}"

echo "==> Building Nuxt app locally"
pnpm "build:${DEPLOY_ENV}"

echo "==> Building Docker image"
docker build \
  --platform "${PLATFORM}" \
  -t "${FULL_IMAGE_NAME}" \
  "${ROOT_DIR}"

echo "==> Build complete"
echo "Image: ${FULL_IMAGE_NAME}"
