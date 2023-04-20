#!/bin/bash

set -e

# Load environment variables from .env file
ENV_FILE_NAME=".env"

if [[ -f ${ENV_FILE_NAME} ]]; then
  echo "Loading environment variables from ${ENV_FILE_NAME}"
  source ${ENV_FILE_NAME}
else
    echo "No .env file found, searched for the following file: ${ENV_FILE_NAME}.  Exiting"
    exit 1
fi
