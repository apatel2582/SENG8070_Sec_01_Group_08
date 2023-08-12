import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class InitializeDatabase1691806121563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('Initializing database... MIGRATION!!!!');
        // Trucks Table
        await queryRunner.createTable(new Table({
            name: 'truck',
            columns: [
                new TableColumn({
                    name: 'truck_id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }),
                new TableColumn({
                    name: 'brand',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'load',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'capacity',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'year',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'number_of_repairs',
                    type: 'int',
                    default: 0
                })
            ]
        }), true);

        console.log('Trucks table created.');

        // Sample Data for Trucks
        await queryRunner.query(`
            INSERT INTO truck (brand, load, capacity, year, number_of_repairs) VALUES
            ('BrandA', 500, 1000, 2020, 1),
            ('BrandB', 600, 1100, 2019, 2),
            ('BrandC', 700, 1200, 2018, 0),
            ('BrandD', 650, 1150, 2021, 1);
        `);

        const results = await queryRunner.query(`
            SELECT * FROM truck;
        `);
        console.log(results);
        // Employees Table
        await queryRunner.createTable(new Table({
            name: 'employee',
            columns: [
                new TableColumn({
                    name: 'employee_id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }),
                new TableColumn({
                    name: 'name',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'surname',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'seniority',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'role',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'category',
                    type: 'varchar',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'specialized_brand',
                    type: 'varchar',
                    isNullable: true
                })
            ]
        }), true);

        console.log('Employees table created.');

        
        
        await queryRunner.query(`
	    INSERT INTO employee (name, surname, seniority, role, category, specialized_brand) VALUES
	    ('John', 'Doe', 'Senior', 'Driver', 'A', null),
	    ('Jane', 'Smith', 'Junior', 'Driver', 'B', null),
	    ('Alice', 'Johnson', 'Senior', 'Mechanic', null, 'BrandA'),
	    ('Bob', 'Brown', 'Junior', 'Mechanic', null, 'BrandB');
	`);
	console.log('Sample data inserted into Employees table.');

    // Customers Table
    await queryRunner.createTable(new Table({
        name: 'customer',
        columns: [
            new TableColumn({
                name: 'customer_id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            }),
            new TableColumn({
                name: 'name',
                type: 'text'
            }),
            new TableColumn({
                name: 'address',
                type: 'text'
            }),
            new TableColumn({
                name: 'phone_number1',
                type: 'text'
            }),
            new TableColumn({
                name: 'phone_number2',
                type: 'text',
                isNullable: true
            }),
        ]
    }), true);
    console.log('Customer table created.');

    await queryRunner.query(`
        INSERT INTO customer (name, address, phone_number1, phone_number2) VALUES
        ('John Doe', '123 Main St', '555-1234', '555-5678'),
        ('Jane Smith', '456 Elm St', '555-4321', null),
        ('Sam Brown', '789 Oak St', '555-8765', '555-6543');
    `);
    console.log('Sample data inserted into Customer table.');

        // Repairs Table
        await queryRunner.createTable(new Table({
            name: 'repair',
            columns: [
                new TableColumn({
                    name: 'repair_id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }),
                new TableColumn({
                    name: 'estimated_time',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'truck_id',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'mechanic_id',
                    type: 'int'
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    columnNames: ['truck_id'],
                    referencedColumnNames: ['truck_id'],
                    referencedTableName: 'truck',
                    onDelete: 'CASCADE'
                }),
                new TableForeignKey({
                    columnNames: ['mechanic_id'],
                    referencedColumnNames: ['employee_id'],
                    referencedTableName: 'employee',
                    onDelete: 'CASCADE'
                })
            ]
        }), true);

        console.log('Repairs table created.');

        
        await queryRunner.query(`
            INSERT INTO repair (mechanic_id, truck_id, estimated_time) VALUES
            (1, 1, 2),   -- Assuming a mechanic with ID 1 and a truck with ID 1 exist in their respective tables
            (1, 2, 3),   -- Assuming a truck with ID 2 exists
            (2, 3, 1),   -- Assuming a mechanic with ID 2 and a truck with ID 3 exist
            (2, 4, 2);   -- Assuming a truck with ID 4 exists
        `);
    
	console.log('Sample data inserted into Repairs table.');


    // Shipments Table
    await queryRunner.createTable(new Table({
        name: 'shipment',
        columns: [
            new TableColumn({
                name: 'shipment_id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            }),
            new TableColumn({
                name: 'customerCustomerId',
                type: 'int'
            }),
            new TableColumn({
                name: 'origin',
                type: 'text'
            }),
            new TableColumn({
                name: 'destination',
                type: 'text'
            }),
            new TableColumn({
                name: 'weight',
                type: 'int'
            }),
            new TableColumn({
                name: 'value',
                type: 'decimal',
                precision: 10,
                scale: 2
            })
        ],
        foreignKeys: [
            new TableForeignKey({
                columnNames: ['customerCustomerId'],
                referencedColumnNames: ['customer_id'],
                referencedTableName: 'customer',
                onDelete: 'CASCADE'
            })
        ]
    }), true);

    console.log('Shipments table created.');

        
    await queryRunner.query(`
        INSERT INTO shipment ("customerCustomerId", origin, destination, weight, value) VALUES
        (1, 'New York', 'Los Angeles', 1000, 2000.50),
        (1, 'Los Angeles', 'Chicago', 1100, 2100.75),
        (1, 'Chicago', 'Houston', 1200, 2200.25),
        (1, 'Houston', 'Phoenix', 1300, 2300.00),
        (1, 'Phoenix', 'Philadelphia', 1400, 2400.50);
    `);

    console.log('Sample data inserted into Shipments table.');


        // Trips Table
        await queryRunner.createTable(new Table({
            name: 'trip',
            columns: [
                new TableColumn({
                    name: 'trip_id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }),
                new TableColumn({
                    name: 'route_from',
                    type: 'text'
                }),
                new TableColumn({
                    name: 'route_to',
                    type: 'text'
                }),
                new TableColumn({
                    name: 'driver1EmployeeId',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'driver2EmployeeId',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'shipmentShipmentId',
                    type: 'int'
                }),
                new TableColumn({
                    name: 'truckTruckId',
                    type: 'int'
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    columnNames: ['driver1EmployeeId'],
                    referencedColumnNames: ['employee_id'],
                    referencedTableName: 'employee',
                    onDelete: 'CASCADE'
                }),
                new TableForeignKey({
                    columnNames: ['driver2EmployeeId'],
                    referencedColumnNames: ['employee_id'],
                    referencedTableName: 'employee',
                    onDelete: 'CASCADE'
                }),
                new TableForeignKey({
                    columnNames: ['driver1EmployeeId'],
                    referencedColumnNames: ['shipment_id'],
                    referencedTableName: 'shipment',
                    onDelete: 'CASCADE'
                }),
                new TableForeignKey({
                    columnNames: ['driver1EmployeeId'],
                    referencedColumnNames: ['truck_id'],
                    referencedTableName: 'truck',
                    onDelete: 'CASCADE'
                })
            ]
        }), true);

        console.log('Trips table created.');
        
        await queryRunner.query(`
            INSERT INTO trip (route_from, route_to, "driver1EmployeeId", "driver2EmployeeId", "shipmentShipmentId", "truckTruckId") VALUES
            ('RouteA1', 'RouteA2', 1, 2, 1, 1),
            ('RouteB1', 'RouteB2', 2, 1, 2, 2),
            ('RouteC1', 'RouteC2', 1, 2, 3, 3),
            ('RouteD1', 'RouteD2', 1, 2, 4, 4);
        `);
        console.log('Sample data inserted into Trips table.');

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE trip;`);
        await queryRunner.query(`DROP TABLE shipment;`);
        await queryRunner.query(`DROP TABLE customer;`);
        await queryRunner.query(`DROP TABLE repair;`);
        await queryRunner.query(`DROP TABLE employee;`);
        await queryRunner.query(`DROP TABLE truck`);
    }
}

