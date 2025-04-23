import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Lote } from './lote.entity';
import { CentroCosto } from './centro-costo.entity';
import { IsOptional } from 'class-validator';
import { Grupo } from './grupo.entity';
import { User } from './user.entity';

@Entity('fincas')
export class Finca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  codigo: string;

  @Column({ length: 100, nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Lote, lote => lote.finca)
  lotes: Lote[];

  @OneToMany(() => CentroCosto, centroCosto => centroCosto.finca)
  centrosCosto: CentroCosto[];

  @OneToMany(() => Grupo, grupo => grupo.finca)
  grupos: Grupo[];

  @ManyToMany(() => User, user => user.fincas)
  usuarios: User[];

  @IsOptional()
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
  
  @IsOptional()
  @UpdateDateColumn({ name: 'updateDate' })
  updateDate: Date;
} 