import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Finca } from './finca.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ type: 'enum', enum: ['M', 'F'] })
  genero: string;

  @Column()
  numDocumento: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ type: 'date' })
  fechaIngresoFinca: Date;

  @Column({ type: 'enum', enum: ['Operativo', 'Oficina'] })
  tipo: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Finca)
  finca: Finca;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 