import { ConnectionOptions } from "typeorm";
import { Truck } from "./src/strategy/postgresql/entities/Truck";
import { Employee } from "./src/strategy/postgresql/entities/Employee";
import { Repair } from "./src/strategy/postgresql/entities/Repair";
import { Customer } from "./src/strategy/postgresql/entities/Customer";
import { Shipment } from "./src/strategy/postgresql/entities/Shipment";
import { Trip } from "./src/strategy/postgresql/entities/Trip";

const ormconfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Truck, Employee, Repair, Customer, Shipment, Trip],
  synchronize: true,
  logging: false,
  migrations: ["/app/dist/migration/*.js"], // This is a common directory structure, adjust if yours is different.
  //subscribers: ["src/subscriber/**/*.ts"], // Adjust if you have subscribers.
  cli: {
    migrationsDir: "/app/dist/migration/",
    //subscribersDir: "src/subscriber"
  }
};

console.log("Migrations TS- ", ormconfig.migrations);

export default ormconfig;
