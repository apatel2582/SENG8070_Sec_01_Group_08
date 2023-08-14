import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check } from "typeorm";
import { Truck } from "./Truck";
import { Employee } from "./Employee";

@Entity()
@Check(`"estimated_time" >= 0 AND "estimated_time" <= 30`)
export class Repair {
  @PrimaryGeneratedColumn()
  repair_id!: number;

  @ManyToOne(() => Truck, (truck) => truck.repairs)
  @JoinColumn({ name: 'truck_id' }) // Explicitly define the foreign key column name
  truck!: Truck;

  @ManyToOne(() => Employee, (employee) => employee.repairs)
  @JoinColumn({ name: 'mechanic_id' }) // Explicitly define the foreign key column name
  mechanic!: Employee;

  @Column()
  estimated_time!: number;
}

