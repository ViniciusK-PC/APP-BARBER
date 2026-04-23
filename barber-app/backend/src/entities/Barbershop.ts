import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Barber } from './Barber';
import { Service } from './Service';

@Entity('barbershops')
export class Barbershop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'time', default: '09:00:00' })
  openTime: string;

  @Column({ type: 'time', default: '18:00:00' })
  closeTime: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Barber, (barber) => barber.barbershop)
  barbers: Barber[];

  @OneToMany(() => Service, (service) => service.barbershop)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
