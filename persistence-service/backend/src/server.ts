//server.ts
require('dotenv').config();
import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./strategy/postgresql";
import { ITruckApi, IEmployeeApi, IRepairApi, ICustomerApi, IShipmentApi, ITripApi } from "./strategy/postgresql/interfaces"; 
import { TruckApi, EmployeeApi, RepairApi, CustomerApi, ShipmentApi, TripApi } from "./strategy/postgresql/entities";

console.log('DB Host:', process.env.DB_HOST);
console.log('User:', process.env.POSTGRES_USER);
console.log('Password:', process.env.POSTGRES_PASSWORD);
console.log('Database:', process.env.POSTGRES_DB);

const initializeApis = (dataSource: any, app: express.Express) => {
  const apis: (ITruckApi | IEmployeeApi | IRepairApi | ICustomerApi | IShipmentApi | ITripApi)[] = [
    new TruckApi(dataSource, app),
    new EmployeeApi(dataSource, app),
    new RepairApi(dataSource, app),
    new CustomerApi(dataSource, app),
    new ShipmentApi(dataSource, app),
    new TripApi(dataSource, app)
  ];
  return apis;
};

(async () => {
  const app = express();
  app.use(cors());
  app.use(json());

  const datasource = await postgresDataSource.initialize();

  initializeApis(datasource, app);

  app.get("/", (_, res) => {
    return res.send("SENG 8070 Section 1 Group 8 Anishkumar Tapaswee Manan");
  });

  interface TableColumn {
    table_name: string;
    columns: string[];
  }

  app.get('/tables', async (_, res) => {
      try {
          const tableNames: any[] = await datasource.query('SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()');

          const tableDetails: Promise<TableColumn>[] = tableNames.map(async table => {
              const columns: any[] = await datasource.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', [table.table_name]);
              return {
                  table_name: table.table_name,
                  columns: columns.map(col => col.column_name)
              };
          });
          const result = await Promise.all(tableDetails);
          res.json(result);
      } catch (error) {
          console.error("Error fetching table and column names:", error);
          res.status(500).send("Failed to fetch table and column names");
      }
  });



  app.listen(8000, () => {
    console.log(`express server started on 8000`);
  });
})().catch((err) => console.log(err));
