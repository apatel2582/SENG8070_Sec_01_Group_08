// entities/Customer.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Shipment } from "./Shipment";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 300 })
  address!: string;

  @Column({ length: 13 })
  phone_number1!: string;

  @Column({ length:13 , nullable: true })
  phone_number2?: string;

  @OneToMany(() => Shipment, (shipment) => shipment.customer)
  shipments!: Shipment[];
}

