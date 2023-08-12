require('dotenv').config();
//import { createConnection } from "typeorm";
import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./strategy/postgresql";
import TruckApi from "./strategy/postgresql/entities/truckApi";
import EmployeeApi from "./strategy/postgresql/entities/employeeApi";
import RepairApi from "./strategy/postgresql/entities/repairApi";
import CustomerApi from "./strategy/postgresql/entities/customerApi";
import ShipmentApi from "./strategy/postgresql/entities/shipmentApi";
import TripApi from "./strategy/postgresql/entities/tripApi";


console.log('DB Host:', process.env.DB_HOST);
console.log('User:', process.env.POSTGRES_USER);
console.log('Password:', process.env.POSTGRES_PASSWORD);
console.log('Database:', process.env.POSTGRES_DB);


(async () => {
  const app = express();
  app.use(cors());
  app.use(json());

  // Initialize TypeORM connection and run migrations
  //const connection = await createConnection(); 
  //const connection = await createConnection();

  // Print some details about the connection
  //console.log('Connected to database:', connection.options.database);
  //console.log('Connection name:', connection.name);
  //console.log(connection);
  //console.log('Connection type:', connection.options.type);

  //await connection.runMigrations();
  //await connection.runMigrations();
  //console.log('Migrations have been successfully run.');


  const datasource = await postgresDataSource.initialize();

  new TruckApi(datasource, app);
  new EmployeeApi(datasource, app);
  new RepairApi(datasource, app);
  new CustomerApi(datasource, app);
  new ShipmentApi(datasource, app);
  new TripApi(datasource, app);

  app.get("/", (_, res) => {
    return res.send("SENG 8070 Section 1 Group 8 Anishkumar Tapaswee Manan");
  });

  app.listen(8000, () => {
    console.log(`express server started on 8000`);
  });
})().catch((err) => console.log(err));
