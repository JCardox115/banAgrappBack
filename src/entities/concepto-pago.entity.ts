import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UnidadMedida } from './unidad-medida.entity';
import { IsNumber, IsOptional } from 'class-validator';

@Entity('conceptos_pago')
export class ConceptoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsOptional()
  codigo?: number;

  @Column()
  descripcion: string;

  @Column()
  @IsOptional()
  @IsNumber()
  unidadMedidaId?: number;

  @ManyToOne(() => UnidadMedida)
  unidadMedida: UnidadMedida;
  @JoinColumn({ name: 'unidadMedidaId' })

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 