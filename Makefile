api:
	cd backend && export $$(cat ../.env | xargs) && ./gradlew bootRun

client:
	cd frontend && npm start

db:
	docker compose -f docker-compose.yml --env-file .env up -d db

all:
	docker compose -f docker-compose.yml --env-file .env build --no-cache
	docker compose -f docker-compose.yml --env-file .env up -d

deploy-api:
	docker compose -f docker-compose.yml --env-file .env build --no-cache backend
	docker compose -f docker-compose.yml --env-file .env up -d backend

deploy-client:
	docker compose -f docker-compose.yml --env-file .env build --no-cache frontend
	docker compose -f docker-compose.yml --env-file .env up -d frontend

down:
	docker compose -f docker-compose.yml --env-file .env down

stop:
	docker compose -f docker-compose.yml --env-file .env stop

migrate:
	cd backend && ./gradlew flywayMigrate



.PHONY: api client db down migrate deploy-api deploy-client all stop