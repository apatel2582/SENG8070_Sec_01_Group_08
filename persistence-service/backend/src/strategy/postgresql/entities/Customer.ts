// entities/Customer.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Shipment } from "./Shipment";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id!: number;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column()
  phone_number1!: string;

  @Column({ nullable: true })
  phone_number2?: string;

  @OneToMany(() => Shipment, (shipment) => shipment.customer)
  shipments!: Shipment[];
}

