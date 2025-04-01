import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Finca } from './finca.entity';

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  hectareasNetas: number;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Finca, finca => finca.lotes)
  finca: Finca;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 