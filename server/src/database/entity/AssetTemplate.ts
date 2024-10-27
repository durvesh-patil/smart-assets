import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class AssetTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 45 })
  name: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "CASCADE" })
  created_by: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "json", nullable: true })
  fields: any;

  @Column({ type: "varchar", length: 45, nullable: true })
  notes: string;
}
