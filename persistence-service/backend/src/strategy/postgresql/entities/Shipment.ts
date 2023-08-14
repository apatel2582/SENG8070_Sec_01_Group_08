// entities/Shipment.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Check } from "typeorm";
import { Customer } from "./Customer";
import { Trip } from "./Trip";

@Entity()
@Check(`"weight" >= 0 AND "weight" <= 50000`) // Check constraint for weight
@Check(`"value" >= 0 AND "value" <= 500000`)  // Check constraint for value
export class Shipment {
  @PrimaryGeneratedColumn()
  shipment_id!: number;

  @ManyToOne(() => Customer, (customer) => customer.shipments)
  @Column({ name: 'customerCustomerId' })
  customer!: Customer;

  @Column({ length: 100 })
  origin!: string;

  @Column({ length: 100 })
  destination!: string;

  @Column()
  weight!: number;

  @Column()
  value!: number;

  @OneToMany(() => Trip, (trip) => trip.shipment)
  trips!: Trip[];
}

