import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Empleado } from './empleado.entity';
import { Lote } from './lote.entity';
import { CentroCosto } from './centro-costo.entity';
import { ConceptoPagoGrupoLabor } from './concepto-pago-grupo-labor.entity';


@Entity('registros_labor')
export class RegistroLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Empleado)
  empleado: Empleado;

  @ManyToOne(() => ConceptoPagoGrupoLabor)
  conceptoPagoGrupoLabor: ConceptoPagoGrupoLabor;

  @ManyToOne(() => CentroCosto)
  centroCosto: CentroCosto;

  @Column({ type: 'date' })
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  valorUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  detalleCantidad: string;

  @Column({ nullable: true })
  observaciones: string;

  @Column()
  anio?: number;

  @Column()
  semana?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  recargo?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  horas?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  semanasEjecutadas?: number;

  @ManyToOne(() => Lote, { nullable: true })
  lote?: Lote;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cantidadLote?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cantidad: number;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  dateUpdate: Date;
} 