import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Empleado } from './empleado.entity';
import { LaborFinca } from './labor-finca.entity';
import { Lote } from './lote.entity';
import { CentroCosto } from './centro-costo.entity';

@Entity('registros_labor')
export class RegistroLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Empleado)
  empleado: Empleado;

  @ManyToOne(() => LaborFinca)
  laborFinca: LaborFinca;

  @ManyToOne(() => CentroCosto)
  centroCosto: CentroCosto;

  @Column({ type: 'date' })
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valorUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  observaciones: string;

  @ManyToOne(() => Lote, { nullable: true })
  lote: Lote;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cantidadLote: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 