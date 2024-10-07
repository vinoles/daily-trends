# Variables #
# Name of the application service defined in docker-compose
APP_SERVICE = app-dayly-trends

# Start all containers in detached mode (running in the background)
up:
	@echo "🚀 Starting all containers in detached mode..."
	docker-compose up -d

# Build or rebuild services and start containers (useful after Dockerfile changes)
build:
	@echo "🔨 Building/rebuilding images and starting containers..."
	docker-compose up --build

# Stop all running containers without removing them (containers can be restarted later)
stop:
	@echo "⏸ Stopping all containers without removing them..."
	docker-compose stop

# Stop and remove all containers, networks, and volumes
down:
	@echo "🛑 Stopping and removing all containers, networks, and volumes..."
	docker-compose down

# Start a bash session inside the application container
bash:
	@echo "💻 Starting a bash session inside the application container..."
	docker-compose exec $(APP_SERVICE) bash

# Restart all containers (stop and then start again)
restart:
	@echo "🔄 Restarting all containers..."
	$(MAKE) down
	$(MAKE) up

# Display live logs from all running containers (press Ctrl+C to stop viewing logs)
logs:
	@echo "📜 Showing live logs from all containers..."
	docker-compose logs -f

# Open a shell inside the app container (useful for debugging)
exec:
	@echo "💻 Opening a shell inside the application container..."
	docker-compose exec $(APP_SERVICE) sh

# Run 'npm install' inside the app container to install dependencies
exec-install:
	@echo "💻 Running 'npm install' inside the application container..."
	docker-compose exec $(APP_SERVICE) npm install

# Run the app in development mode inside the container
exec-start:
	@echo "💻 Running the app in development mode inside the container..."
	docker-compose exec $(APP_SERVICE) npm run start

# Run the app in watch mode (auto-restart on changes) inside the container
exec-dev:
	@echo "💻 Running the app in watch mode inside the container..."
	docker-compose exec $(APP_SERVICE) npm run start:dev

# Build the application inside the container
exec-build:
	@echo "💻 Building the application inside the container..."
	docker-compose exec $(APP_SERVICE) npm run build

# Run linters inside the container to verify code quality
exec-lint:
	@echo "💻 Running linters inside the container..."
	docker-compose exec $(APP_SERVICE) npm run lint

# Run tests inside the container
exec-test:
	@echo "💻 Running tests inside the container..."
	docker-compose exec $(APP_SERVICE) npm run test

# Run tests inside the container for file (example: make exec-test-file file="src/feeds/test/services/feeds.service.create.spec.ts")
exec-test-file:
	@echo "💻 Running tests inside the container for file..."
	docker-compose exec $(APP_SERVICE) npm run test $(file)

# Run any custom command inside the app container (example: 'make exec-cmd cmd="npm run lint"')
exec-cmd:
	@echo "💻 Running a custom command inside the application container..."
	docker-compose exec $(APP_SERVICE) $(cmd)
