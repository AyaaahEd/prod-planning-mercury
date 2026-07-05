FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# On copie le fichier .jar compilé par Maven
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
