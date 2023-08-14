// entities/Employee.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Repair } from "./Repair";
import { Trip } from "./Trip";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  surname!: string;

  @Column({ length: 100 })
  seniority!: string;

  @Column({ length: 100 })
  role!: string; // Consider using an ENUM for Driver/Mechanic

  @Column({ nullable: true, length: 100 })
  category?: string;

  @Column({ nullable: true, length: 100 })
  specialized_brand?: string;

  @OneToMany(() => Repair, (repair) => repair.mechanic)
  repairs!: Repair[];

  @OneToMany(() => Trip, (trip) => trip.driver1)
  tripsAsDriver1!: Trip[];

  @OneToMany(() => Trip, (trip) => trip.driver2)
  tripsAsDriver2!: Trip[];
}

