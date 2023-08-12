import { DataSource } from "typeorm";
import { Truck } from "./entities/Truck";
import { Employee } from "./entities/Employee";
import { Repair } from "./entities/Repair";
import { Customer } from "./entities/Customer";
import { Shipment } from "./entities/Shipment";
import { Trip } from "./entities/Trip";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [Truck, Employee, Repair, Customer, Shipment, Trip],
  migrations: ["/app/dist/migration/*.js"], // specify the migration path
});

console.log("Migrations CONFIGURE.ts - ", postgresDataSource.migrations);