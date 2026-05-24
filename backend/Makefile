api:
	@set -a; source ../.env; set +a; ./gradlew bootRun

migrate:
	@set -a; source ../.env; set +a; ./gradlew flywayMigrate

build:
	@set -a; source ../.env; set +a; ./gradlew build -x test

.PHONY: api client db down migrate build