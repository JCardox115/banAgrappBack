import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Finca } from './finca.entity';
import { Labor } from './labor.entity';

@Entity('grupos_labor')
export class GrupoLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => Finca)
  finca: Finca;

  @OneToMany(() => Labor, labor => labor.grupoLabor)
  labores: Labor[];

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 