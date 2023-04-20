#!/bin/sh

set -e

if [[ -z "${GIT_REPOSITORY_URL}" ]]; then
  echo "GIT_REPOSITORY_URL must be set, exiting"
  exit 1
fi

echo "Cloning repository from ${GIT_REPOSITORY_URL}"

REPO_DIR="../my-repo"
if [[ -z "${REPOSITORY_LOCAL_LOCATION}" ]]; then
  echo "REPOSITORY_LOCAL_LOCATION not set, using default destination: ${REPO_DIR}"
else
  REPO_DIR="${REPOSITORY_LOCAL_LOCATION}"
  echo "REPOSITORY_LOCAL_LOCATION set, using: ${REPO_DIR}"
fi

# Clean up the repo directory if it already exists
if [ -d "$REPO_DIR" ]; then
  echo "Removing existing repo directory"
  rm -rf "$REPO_DIR"
fi

# Clone the repository
git clone $GIT_REPOSITORY_URL $REPO_DIR
