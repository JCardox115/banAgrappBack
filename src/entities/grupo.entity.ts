import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Finca } from './finca.entity';
import { Labor } from './labor.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @Column()
  fincaId: number;

  @ManyToOne(() => Finca)
  finca: Finca;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  dateUpdate: Date;
} 