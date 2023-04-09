#!/bin/sh

set -e

echo "Cloning repository from ${GIT_REPOSITORY_URL}"

REPO_DIR="my-repo"

# Clean up the repo directory if it already exists
if [ -d "$REPO_DIR" ]; then
  echo "Removing existing repo directory"
  rm -rf "$REPO_DIR"
fi

# Clone the repository
git clone $GIT_REPOSITORY_URL $REPO_DIR

ls
