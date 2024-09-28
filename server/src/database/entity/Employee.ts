import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeNo: number;

  @Column()
  fullName: string;

  @Column()
  joiningDate: string;

  @Column({ default: "N/A" })
  resignDate: string;

  @Column({ default: "N/A" })
  department: string;

  @Column({ default: "6" })
  floor: "5" | "6";

  @Column({ default: "N/A" })
  emailId: string;

  @Column({ default: "N/A" })
  skypeId: string;
}
