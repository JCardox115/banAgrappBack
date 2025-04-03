import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Labor } from './labor.entity';
import { Finca } from './finca.entity';

@Entity('labores_finca')
export class LaborFinca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  codigo?: string;

  @ManyToOne(() => Labor, labor => labor.laboresFinca)
  labor: Labor;

  @ManyToOne(() => Finca, finca => finca.laboresFinca)
  finca: Finca;

  @Column('decimal', { precision: 10, scale: 2 })
  precioEspecifico: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 