# Fullstack CI with Docker 🚀

This project demonstrates a full-stack CI pipeline that builds both a frontend Node.js application and a backend Java application. The pipeline includes the following steps:
- Setting up a PostgreSQL database
- Building the backend with Maven
- Building the frontend Node.js application
- Dockerizing both backend and frontend apps
- Pushing the Docker images to Docker Hub



## Prerequisites 🛠️

Before setting up this CI pipeline, make sure you have the following:

1. **GitHub Repository**: Create a GitHub repository for your full-stack application.
2. **Docker Hub Account**: Set up an account on [Docker Hub](https://hub.docker.com/) to push Docker images.
3. **Maven**: Ensure that Maven is used for the backend Java application.
4. **Node.js**: Ensure that Node.js and NPM are set up for the frontend application.

## GitHub Actions Workflow 🔄

The following GitHub Actions workflow is used to set up and build both the backend and frontend applications, and then deploy them as Docker images.

### Workflow Trigger 🚨

The workflow is triggered on push or pull request to the `main` branch.

```
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```

## Database Setup 🗄️

The first job sets up a PostgreSQL database using Docker.
The PostgreSQL container is configured with a database name, username, and password as environment variables.
An SQL initialization script is run to set up the schema or initial data in the database.
```
jobs:
  database-setup:
    name: Setup Database
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: mydatabase
          POSTGRES_USER: myuser
          POSTGRES_PASSWORD: mypassword
        ports:
          - 5432:5432
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Wait for Database to be Ready
        run: sleep 10

      - name: Run SQL Initialization Script
        run: |
          PGPASSWORD=mypassword psql -h localhost -U myuser -d mydatabase -f ./fullstack-app/mysql/init.sql
```
## Backend Build and Docker Image 🖥️

After the database setup, the backend Java application is built using Maven.
A Docker image is created for the backend, and it's pushed to Docker Hub.
```
  backend-build:
    name: Build Backend and Create Docker Image
    runs-on: ubuntu-latest
    needs: database-setup
    defaults:
      run:
        working-directory: ./fullstack-app/backend-java-app
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set Up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Build with Maven
        run: mvn clean package -DskipTests

      - name: Upload Backend Artifact
        uses: actions/upload-artifact@v4
        with:
          name: backend-java-build
          path: ./fullstack-app/backend-java-app/target/*.jar

      - name: Log in to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build and Push Docker Image (Backend)
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/backend-java-app:latest .
          docker push ${{ secrets.DOCKER_USERNAME }}/backend-java-app:latest
```
## Frontend Build and Docker Image 🌐

The frontend Node.js application is built using NPM.
The build artifacts are uploaded as an artifact.
A Docker image is created for the frontend, and it is pushed to Docker Hub.
```
  frontend-build:
    name: Build Frontend and Create Docker Image
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./fullstack-app/frontend-node-app
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set Up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm install

      - name: Build Frontend
        run: npm run build  # Ensure the build command exists in package.json

      - name: Upload Frontend Build
        uses: actions/upload-artifact@v4
        with:
          name: frontend-node-build
          path: ./fullstack-app/frontend-node-app/build  # Ensure this path is correct

      - name: Log in to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build and Push Docker Image (Frontend)
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/frontend-node-app:latest .
          docker push ${{ secrets.DOCKER_USERNAME }}/frontend-node-app:latest
```
## Secrets Setup 🔐

In your GitHub repository, ensure that you have set the following secrets in the repository settings:

DOCKER_USERNAME: Your Docker Hub username.
DOCKER_PASSWORD: Your Docker Hub password or token.

## How to Use 📝

Push Changes: Push your changes to the main branch of the repository, or open a pull request to trigger the workflow.
Monitor the Pipeline: You can monitor the progress of the CI pipeline in the "Actions" tab of your GitHub repository.
Docker Images: Once the pipeline completes successfully, you can find the Docker images for both the backend and frontend apps in your Docker Hub account.

## 🎉 Hurray! Your Docker Images Are Deployed! 🎉

Congratulations! You've successfully built and deployed your backend and frontend Docker images. 🎉 You can now see your apps live on Docker Hub.

### Feel Free to Contribute! 🤝

- **Fork** the repository and make your improvements.
- **Star** the repo if you found it helpful.
- **Create Issues** if you encounter any problems or have suggestions.

Thanks for checking out this project, and happy coding! 🚀


