import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Finca } from './finca.entity';

@Entity('centros_costo')
export class CentroCosto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @Column()
  fincaId: number;

  @ManyToOne(() => Finca, finca => finca.centrosCosto)
  finca: Finca;

  @Column({ default: true })
  activo: boolean;

  @Column({ default: false })
  isPrincipal: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 