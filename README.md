# AI Bug Buster

This is a project aimed to make bug and error fixes to an automated process.
The vision for the AI Bug Buster is to be able to pass it a stack trace from you application,
let it analyze the stack trace, make the necessary changes to you application and open up a
pull request in your repository with the applied changes.

It should be a service that you could hook up to your alarm servcie and calling it automatically if a critical
bug or error appears in your running application. When you get a notification on an error from
you application you won't need to go through your usual process of analyzing the error, browsing
the code to find and fix the issue. You would simply go to your git repository and the AI Bug Buster
will have a pull request ready for you to merge and deploy.

Well, that might be the end goal, but we are far from there.
We have an application that can:

- Pull down a repository
- Receive a stack trace and analyze it
- Figure out the files to be changed
- Update the file with the changes

The application is in an early stage and needs a lot of improvement in order to be remotely useful.
Writing the best possible prompt for the AI is an area of big improvements.

## Powered by ChatGPT

To no ones suprprise this application is powered by OpenAI's ChatGPT.
You would need a OpenAI API key to run this application.

> Disclaimer
> AI Bug Buster and its developers are not responsible for any actions taken with this project. By using this project you agree on doing so at your own risk. No developers of the AI Bug Buster can be held responsible for any outcomes of the use of this software. Everyhing you do is at your own risk.

## Run the application

There is three ways of running the appication:

1. As a local "one-time" run
2. As a web server
3. As a web server inside a Docker container

Before you can run any of the alternatives you need to provide a set of environment variables to the application.
To create the `.env` file run the following command from the root of the project:

```bash
$ cp .env.example .env
```

Insiden the created `.env` file, make the appropriate changes

| Variable                  | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| GIT_REPOSITORY_URL        | The url to your repository                                                  |
| OPENAI_API_KEY            | The API key for ChatGPT                                                     |
| REPOSITORY_LOCAL_LOCATION | The location on your computer you want to place your pulled down repository |

> If the repository you want to scan is a private repository, authentication needs to be passed
> in the repositpry url e.g:
> `https://<username>:<GitHub API Key>@github.com/your/repository.git`

### Local one-time run

The easiest way of exploring the application is to run it locally through the `./run.sh` script.

It will pull down the repositry you want to scan into the directory you provided in the `REPOSITORY_LOCAL_LOCATION` variable.
It will then start the AI Bug Buster that will analyze the stacktrace and update the code in the
repository you provided. When done it will shut down. You can now examine the changes inside the
pulled down repository to see what changes the AI Bug Buster has made.

#### Provide the stack trace

When running the local version, the AI Bug Buster expects a `local.txt` file in the root of the project containing a stack trace to analyze.

To provide the AI Bug Buster with the stack trace create a file called `local.txt` in the root of
the repositry and paste in the stack trace you want to analyze inside the file. The construction of the prompts to analyze the stack trace will be composed by the AI Bug Buster.
So just provide the stack trace and nothing else.

Now you are ready to run the AI Bug Buster:

```bash
$ ./run.sh
```

### Run as Web Server

_TODO: Fill in documentation_

### Run as Web Server inside Docker

_TODO: Fill in documentation_

Use the following command to run the application

```
$ docker build -t my-app .
$ docker run --env-file .envs -p 3000:3000 my-app
```
