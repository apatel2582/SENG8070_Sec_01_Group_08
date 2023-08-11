// entities/Trip.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Truck } from "./Truck";
import { Employee } from "./Employee";
import { Shipment } from "./Shipment";

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  trip_id!: number;

  @Column()
  route_from!: string;

  @Column()
  route_to!: string;

  @ManyToOne(() => Employee, (employee) => employee.tripsAsDriver1)
  driver1!: Employee;

  @ManyToOne(() => Employee, (employee) => employee.tripsAsDriver2)
  driver2!: Employee;

  @ManyToOne(() => Shipment, (shipment) => shipment.trips)
  shipment!: Shipment;

  @ManyToOne(() => Truck, (truck) => truck.trips)
  truck!: Truck;
}

