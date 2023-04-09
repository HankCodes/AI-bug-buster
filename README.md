# AI-auto-pull-request

## Prerequisities
To run the application you need the following software installed
1. Docker

## Run the application

You need to provide a set of encironment vatiables to the docker container.
To create the `.env` file that the docker container needs you can run the following command:
````
$ cp .envs.example .envs
````
Insiden the created `.envs` file, replace the `GIT_REPOSITORY_URL` environment variable
with the url to the repository to use.

Use the following command to run the application
````
$ docker build -t my-app .
$ docker run --env-file .envs -p 3000:3000 my-app
````