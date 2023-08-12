// entities/Shipment.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Customer } from "./Customer";
import { Trip } from "./Trip";

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  shipment_id!: number;

  @ManyToOne(() => Customer, (customer) => customer.shipments)
  @Column({ name: 'customerCustomerId' })
  customer!: Customer;

  @Column()
  origin!: string;

  @Column()
  destination!: string;

  @Column()
  weight!: number;

  @Column()
  value!: number;

  @OneToMany(() => Trip, (trip) => trip.shipment)
  trips!: Trip[];
}

