# SENG8070_Sec_01_Group_08
##### SENG 8070 Database Testing Finals
##### Section 1 - Group 8 
#### Final Project

persistence-service folder -> docker-compse.yml
go inside persistence-service folder
run this command - 
docker-compose up --build
open another terminal to run other commands (make sure the directory is the same, inside persistence-service)- 
docker-compose exec npm test
for specific tests - 
docker-compose exec npm test truckApi.test.ts
docker-compose exec npm test customerApi.test.ts
docker-compose exec npm test employeeApi.test.ts
docker-compose exec npm test repairApi.test.ts
docker-compose exec npm test shipmentApi.test.ts
docker-compose exec npm test tripApi.test.ts
docker-compose exec npm test integration.test.ts

There are multiple test suites within each test 
