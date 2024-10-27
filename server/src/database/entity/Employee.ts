import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  employeeNo: number;

  @Column({ type: "varchar", length: 255 })
  fullName: string;

  @Column({ type: "varchar", length: 255 })
  joiningDate: string;

  @Column({ type: "varchar", length: 255, default: "N/A" })
  resignDate: string;

  @Column({ type: "varchar", length: 255 })
  department: string;

  @Column({ type: "varchar", length: 255 })
  floor: string;

  @Column({ type: "varchar", length: 255 })
  emailId: string;

  @Column({ type: "varchar", length: 255, default: "N/A" })
  skypeId: string;
}
