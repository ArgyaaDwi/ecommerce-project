api:
	cd backend && ./gradlew bootRun

client:
	cd frontend && npm start

db:
	docker compose -f docker-compose.yml --env-file .env up -d db

all:
	docker compose -f docker-compose.yml --env-file .env build
	docker compose -f docker-compose.yml --env-file .env up -d

down:
	docker compose -f docker-compose.yml --env-file .env down

migrate:
	cd backend && ./gradlew flywayMigrate

.PHONY: api client db down migrate