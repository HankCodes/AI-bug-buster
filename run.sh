#!/bin/bash

source ./set-envs.sh

export GIT_REPOSITORY_URL
export REPOSITORY_LOCAL_LOCATION

# Run clone-repository.sh with the environment variables
./clone-repository.sh

# if ./clone-repository.sh was successful run the rest of the script
if [[ $? -eq 0 ]]; then
  # Run the bug-buster.sh script
   ts-node src/runLocal.ts
else
    echo "Something failed, AI Bug Buster will not be started. Exiting"
fi
