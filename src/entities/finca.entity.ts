import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lote } from './lote.entity';
import { CentroCosto } from './centro-costo.entity';
import { LaborFinca } from './labor-finca.entity';

@Entity('fincas')
export class Finca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Lote, lote => lote.finca)
  lotes: Lote[];

  @OneToMany(() => CentroCosto, centroCosto => centroCosto.finca)
  centrosCosto: CentroCosto[];

  @OneToMany(() => LaborFinca, laborFinca => laborFinca.finca)
  laboresFinca: LaborFinca[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 