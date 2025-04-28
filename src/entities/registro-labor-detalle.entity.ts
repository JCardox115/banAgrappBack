import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { RegistroLabor } from './registro-labor.entity';
import { Lote } from './lote.entity';

@Entity('registros_labor_detalle')
export class RegistroLaborDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RegistroLabor, registro => registro.detalles)
  @JoinColumn({ name: 'registroLaborId' })
  registroLabor: RegistroLabor;

  @Column()
  registroLaborId: number;

  @ManyToOne(() => Lote, { nullable: true })
  lote: Lote;

  @Column({ nullable: true })
  loteId: number;

  @Column({ nullable: true })
  loteNumero: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  area: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  areaRealizada: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  recargo: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  semanasEjecutadas: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 