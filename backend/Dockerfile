# syntax=docker/dockerfile:1

FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline
COPY src ./src
RUN ./mvnw -q -DskipTests package \
 && cp target/*.jar /app/app.jar

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl \
 && addgroup -S app && adduser -S app -G app
USER app
COPY --from=build /app/app.jar /app/app.jar
EXPOSE 8081
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
