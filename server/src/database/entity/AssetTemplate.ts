import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class AssetTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 45 })
  name: string;

  @ManyToOne(() => User, { nullable: true })
  created_by: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  last_updated_at: Date;

  @Column({ type: "varchar", length: 45, nullable: true })
  notes: string;

  @Column({ type: "json", nullable: true })
  fields: any;
}
