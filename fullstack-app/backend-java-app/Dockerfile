FROM maven:3.8.5-openjdk-17
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
CMD ["java", "-cp", "target/classes", "Main"]

