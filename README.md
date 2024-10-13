<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## DailyTrends API Overview

## API Name: DailyTrends

### Description:

DailyTrends is a news aggregator API that provides users with a curated feed of the latest headlines from leading newspapers. The API focuses on delivering the top five headlines from two prominent Spanish newspapers, El País and El Mundo.

## Project setup run

```bash
$ make build or docker-compose up --build

$ make exec-install
```

## Commands Makefile

```bash

# Start all containers in detached mode (running in the background)
$ make up

# Build or rebuild services and start containers (useful after Dockerfile changes)
$ make build

# Stop all running containers without removing them (containers can be restarted later)
$ make stop

# Stop and remove all containers, networks, and volumes
$ make down

# Start a bash session inside the application container
$ make bash

# Restart all containers (stop and then start again)
$ make restart

# Display live logs from all running containers (press Ctrl+C to stop viewing logs)
$ make logs

# Open a shell inside the app container (useful for debugging)
$ make exec

# Run 'npm install' inside the app container to install dependencies
$ make exec-install

# Run the app in development mode inside the container
$ make exec-start

# Run the app in watch mode (auto-restart on changes) inside the container
$ make exec-dev

# Build the application inside the container
$ make exec-build

# Run linters inside the container to verify code quality
$ make exec-lint

# Run tests inside the container
$ make exec-test

# Run any custom command inside the app container (example: 'make exec-cmd cmd="npm run lint"')
$ make exec-cmd cmd="your-command-here"

```
## Open

[http://localhost:3001/api](http://localhost:3001/api)

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- Puppeteer Visit the [Puppeteer Documentation](https://pptr.dev/category/introduction) to learn more about the package.

## Stay in touch

- Author - [Felipe Vinoles](https://www.linkedin.com/in/felipe-vi%C3%B1oles-51731137/)



