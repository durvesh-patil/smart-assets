import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Employee } from "./Employee";

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 45 })
  name: string;

  @ManyToOne(() => User, { nullable: true })
  created_by: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @ManyToOne(() => Employee, { nullable: true })
  assigned_to: Employee;

  @Column({ type: "varchar", length: 45 })
  status: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  notes: string;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  last_updated_at: Date;

  @Column({ type: "json", nullable: true })
  data: any;
}
