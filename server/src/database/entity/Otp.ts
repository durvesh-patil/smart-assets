import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Otp {
  @Column({ type: "int" })
  otp: number;

  @PrimaryColumn({ type: "varchar", length: 255 })
  email: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
