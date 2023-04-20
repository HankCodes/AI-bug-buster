#!/bin/bash

source ./set-envs.sh

export GIT_REPOSITORY_URL
export REPOSITORY_LOCAL_LOCATION

# Run clone-repository.sh with the environment variables
./clone-repository.sh
