import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Barbershop } from './Barbershop';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  duration: number; // em minutos

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.services)
  @JoinColumn({ name: 'barbershopId' })
  barbershop: Barbershop;

  @Column()
  barbershopId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
