# Multi-stage Dockerfile for WorkerBackend
# Stage 1: Build
FROM gradle:8.7-jdk21-jammy AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon -x test

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy
RUN mkdir /app
COPY --from=build /home/gradle/src/build/libs/*.jar /app/worker-backend.jar
ENTRYPOINT ["java", "-jar", "/app/worker-backend.jar"]
EXPOSE 8080
