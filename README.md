# SENG8070 Database Testing Finals

### Section 1 - Group 8 
- **Anishkumar Patel** - 8882582
- **Tapaswee Dixit** - 8559139
- **Manan Muliyana** - 8802389

## Final Project

Ensure that there are no running Docker containers. We want a clean environment to successfully execute our Dockerfiles.


### 1. Persistence Service
- Navigate to the `persistence-service` folder.
- Open terminal in this directory.
- **Note:** We have provided the `.env` file. If there are any discrepancies, adjust it accordingly. There's a separate `.env` file inside the `backend` folder for development purposes.
- Execute the following commands:
  ```bash
  docker-compose up --build # If you want to see the server and docker logs
  docker-compose up -d --build # To use the same terminal for other commands
  ```
- For running tests, open another terminal (ensure you're still inside the persistence-service directory):
  ```bash
  docker-compose exec backend npm test
  ```
- For specific tests:
  ```bash
  docker-compose exec backend npm test truckApi.test.ts
  docker-compose exec backend npm test customerApi.test.ts
  docker-compose exec backend npm test employeeApi.test.ts
  docker-compose exec backend npm test repairApi.test.ts
  docker-compose exec backend npm test shipmentApi.test.ts
  docker-compose exec backend npm test tripApi.test.ts
  docker-compose exec backend npm test integration.test.ts
  ```
- After testing, shut down the Docker containers and clean the volumes:
  ```bash
  docker-compose down -v
  ```

### 2. Integration Tests
- Navigate to the integration-tests folder.
- Open terminal in this directory.
- **Note:** We have not provided a .env file for this section. However, you can use the env.example file as a reference.
- Execute the following commands:
  ```bash
  docker-compose up --build # If you want to see the server and docker logs
  docker-compose up -d --build # To use the same terminal for other commands
  ```
- **Note:** Once docker-compose builds and runs, all tests will be executed automatically. The test results can be found in the junit.xml file located inside the results folder of the integration-tests directory.
- After testing, shut down the Docker containers and clean the volumes:
  ```bash
  docker-compose down -v
  ```

### 3. Development Environment Setup
Ensure you have node and npm installed on your system.
- For Windows, download them from the official Node.js website.
- Verify the installation:
  ```bash
  node -v
  npm -v
  ```
  If installed correctly, you should see their version numbers.
- Install the required dependencies:
  ```bash
  npm install
  ```
- Start the development environment:
  ```
  npm start
  ```

**Warning:** Ensure you have PostgreSQL installed and set up. For our initial development on Ubuntu VM, this wasn't an issue. However, when transitioning to Windows for Docker configuration, manual installation of PostgreSQL was required for development.

**Note:** A Migration Database is executed during the docker-compose up --build command in both the persistence-service and integration-tests folders.

The folder names remain unchanged as this project is based on the `postgres-orm-integration` branch from [here](https://gitlab.com/conestogac/persistence-service/-/tree/postgres-orm-integration?ref_type=heads).

### Thank you for your attention!
