# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar pom.xml e baixar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar codigo fonte e compilar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar JAR do stage de build
COPY --from=build /app/target/barber-app-1.0.0.jar app.jar

# Expor porta
EXPOSE 8080

# Variavel de ambiente para porta (Render usa $PORT)
ENV PORT=8080

# Comando para iniciar a aplicacao
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
