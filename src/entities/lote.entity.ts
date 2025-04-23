import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Finca } from './finca.entity';
import { TipoSuelo } from './tipo-suelo.entity';
import { IsOptional } from 'class-validator';

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, name: 'num_lote', nullable: false })
  numLote: string;

  @Column({ name: 'finca_id', nullable: false })
  fincaId: number;

  @Column({ name: 'tipo_suelo_id', nullable: false })
  tipoSueloId: number;

  @Column({ name: 'hectareas_netas', type: 'decimal', precision: 10, scale: 2, nullable: false })
  hectareasNetas: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creation_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate: Date;

  @ManyToOne(() => Finca, finca => finca.lotes)
  @JoinColumn({ name: 'finca_id' })
  finca: Finca;

  @ManyToOne(() => TipoSuelo)
  @JoinColumn({ name: 'tipo_suelo_id' })
  tipoSuelo: TipoSuelo;
} 