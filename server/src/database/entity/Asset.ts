import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from './User'; 
import { Employee } from './Employee'; 
import { AssetTemplate } from './AssetTemplate'; 

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assigned_to: Employee;

  @ManyToOne(() => AssetTemplate, { nullable: true })
  @JoinColumn({ name: 'template_id' })
  template_id: AssetTemplate;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'varchar', length: 45 })
  status: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  notes: string;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  last_updated_at: Date;

  @Column({ type: 'json', nullable: true })
  data: any;
}
