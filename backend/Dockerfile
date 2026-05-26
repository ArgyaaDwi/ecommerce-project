# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /workspace

# Copy gradle files
COPY backend/gradlew .
COPY backend/gradle gradle
COPY backend/build.gradle .
COPY backend/settings.gradle .

# Make gradlew executable
RUN chmod +x gradlew

# Copy source code
COPY backend/src src

COPY .env .env

# Build the application
RUN ./gradlew clean bootJar -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy jar from builder stage
COPY --from=builder /workspace/build/libs/*.jar app.jar

# Expose port
EXPOSE 5000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
