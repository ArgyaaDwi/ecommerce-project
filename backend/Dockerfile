# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /workspace

# Copy gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x gradlew

# Copy source code
COPY src src

# Build the application
RUN ./gradlew clean bootJar -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy jar from builder stage
COPY --from=builder /workspace/build/libs/*.jar app.jar

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD sh -c 'curl -f http://localhost:5000/actuator/health || exit 1'

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
