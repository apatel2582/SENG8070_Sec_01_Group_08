// entities/Trip.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Truck } from "./Truck";
import { Employee } from "./Employee";
import { Shipment } from "./Shipment";

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  trip_id!: number;

  @Column({ length: 100 })
  route_from!: string;

  @Column({ length: 100 })
  route_to!: string;

  @ManyToOne(() => Employee, (employee) => employee.tripsAsDriver1)
  //@Column({ name: 'driver1EmployeeId' })
  driver1!: Employee;

  @ManyToOne(() => Employee, (employee) => employee.tripsAsDriver2)
  //@Column({ name: 'driver2EmployeeId' })
  driver2!: Employee;

  @ManyToOne(() => Shipment, (shipment) => shipment.trips)
  //@Column({ name: 'shipmentShipmentId' })
  shipment!: Shipment;

  @ManyToOne(() => Truck, (truck) => truck.trips)
  //@Column({ name: 'truckTruckId' })
  truck!: Truck;
}

