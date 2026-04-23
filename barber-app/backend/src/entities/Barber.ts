import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Barbershop } from './Barbershop';
import { Appointment } from './Appointment';

@Entity('barbers')
export class Barber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  availability: {
    [key: string]: { // day of week (0-6)
      enabled: boolean;
      slots: string[]; // ['09:00', '09:30', '10:00', ...]
    };
  };

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.barbers)
  @JoinColumn({ name: 'barbershopId' })
  barbershop: Barbershop;

  @Column()
  barbershopId: string;

  @OneToMany(() => Appointment, (appointment) => appointment.barber)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
