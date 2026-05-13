#!/usr/bin/env bash

set -euo pipefail

# 部署环境：优先使用参数或环境变量；都没有时在终端里选择
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_ENV="$(bash "${ROOT_DIR}/scripts/select-env.sh" "${1:-}")"
# 项目名称，会参与生成镜像名
PROJECT_NAME="${PROJECT_NAME:-lingxi-workbench-front}"
# Docker Hub 用户名，例如: yourname
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-yafenghuang777}"
# 镜像仓库名，默认: 项目名称-环境
IMAGE_NAME="${IMAGE_NAME:-${PROJECT_NAME}-${DEPLOY_ENV}}"
# 镜像标签；如果不传，默认 latest，方便手动拉取
IMAGE_TAG="${IMAGE_TAG:-latest}"
# 完整镜像名；如果你已经手动传了 FULL_IMAGE_NAME，会优先使用你传入的值
FULL_IMAGE_NAME="${FULL_IMAGE_NAME:-${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}}"
# 拉取平台，默认与构建平台一致
PLATFORM="${PLATFORM:-linux/amd64}"

echo "==> Pulling image: ${FULL_IMAGE_NAME}"
echo "Environment: ${DEPLOY_ENV}"
docker pull --platform "${PLATFORM}" "${FULL_IMAGE_NAME}"

echo "==> Pull complete"
