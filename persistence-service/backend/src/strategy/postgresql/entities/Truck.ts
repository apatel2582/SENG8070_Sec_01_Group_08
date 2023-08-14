// entities/Truck.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Check } from "typeorm";
import { Repair } from "./Repair";
import { Trip } from "./Trip";

@Entity()
@Check("year >= 1950 AND year <= 2023")
@Check("capacity BETWEEN 0 AND 16000")
@Check("load BETWEEN 0 AND 16000")
@Check("number_of_repairs BETWEEN 0 AND 199")
export class Truck {
  @PrimaryGeneratedColumn()
  truck_id!: number;

  @Column({ length: 100 })
  brand!: string;

  @Column()
  load!: number;

  @Column()
  capacity!: number;

  @Column()
  year!: number;

  @Column()
  number_of_repairs!: number;

  @OneToMany(() => Repair, (repair) => repair.truck)
  repairs!: Repair[];

  @OneToMany(() => Trip, (trip) => trip.truck)
  trips!: Trip[];
}