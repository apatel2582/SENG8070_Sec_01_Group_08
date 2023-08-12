import { DataSource } from "typeorm"
import * as allExports from "./strategy/postgresql/entities";

// Filter out only the entities (those that don't end with 'Api')
const entities = Object.values(allExports).filter(
    exportItem => typeof exportItem !== 'function' || !exportItem.name.endsWith('Api')
);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: entities,
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        console.log("Entities:", entities)
        console.log("Truck:", entities[0].name)
        console.log("List of all trucks:");
        //console.log("Connection:", AppDataSource.connection)
        //console.log(AppDataSource)
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });

 