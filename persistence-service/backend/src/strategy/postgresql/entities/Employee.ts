// entities/Employee.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Repair } from "./Repair";
import { Trip } from "./Trip";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id!: number;

  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column()
  seniority!: string;

  @Column()
  role!: string; // Consider using an ENUM for Driver/Mechanic

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  specialized_brand?: string;

  @OneToMany(() => Repair, (repair) => repair.mechanic)
  repairs!: Repair[];

  @OneToMany(() => Trip, (trip) => trip.driver1)
  tripsAsDriver1!: Trip[];

  @OneToMany(() => Trip, (trip) => trip.driver2)
  tripsAsDriver2!: Trip[];
}

