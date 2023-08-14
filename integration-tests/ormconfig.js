const { postgresDataSource } = require('./src/strategy/postgresql/configure');

module.exports = {
    type: postgresDataSource.options.type,
    host: postgresDataSource.options.host,
    port: postgresDataSource.options.port,
    username: postgresDataSource.options.username,
    password: postgresDataSource.options.password,
    database: postgresDataSource.options.database,
    synchronize: postgresDataSource.options.synchronize,
    logging: postgresDataSource.options.logging,
    entities: [
        "/app/dist/strategy/postgresql/entities/Truck.js",
        "/app/dist/strategy/postgresql/entities/Employee.js",
        "/app/dist/strategy/postgresql/entities/Repair.js",
        "/app/dist/strategy/postgresql/entities/Customer.js",
        "/app/dist/strategy/postgresql/entities/Shipment.js",
        "/app/dist/strategy/postgresql/entities/Trip.js"
    ],
    migrations: ["/app/dist/migration/*.js"],
    cli: {
        migrationsDir: "/app/dist/migration"
    }
};

console.log('postgresDataSource.options JS', postgresDataSource.options);