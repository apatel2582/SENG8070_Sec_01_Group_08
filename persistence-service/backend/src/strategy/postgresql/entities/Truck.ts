// entities/Truck.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Repair } from "./Repair";
import { Trip } from "./Trip";

@Entity()
export class Truck {
  @PrimaryGeneratedColumn()
  truck_id!: number;

  @Column()
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

