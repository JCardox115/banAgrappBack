import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RegistroLabor } from './registro-labor.entity';
import { ConceptoPago } from './concepto-pago.entity';
import { GrupoLabor } from './grupo-labor.entity';
import { IsOptional } from 'class-validator';
@Entity('concepto_pago_grupo_labor')
export class ConceptoPagoGrupoLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsOptional()
  conceptoPagoId?: number;

  @Column()
  @IsOptional()
  grupoLaborId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RegistroLabor, registroLabor => registroLabor.conceptoPagoGrupoLabor)
  registrosLabor: RegistroLabor[];

  @ManyToOne(() => ConceptoPago)
  @JoinColumn({ name: 'conceptoPagoId' })
  conceptoPago: ConceptoPago;

  @ManyToOne(() => GrupoLabor)
  @JoinColumn({ name: 'grupoLaborId' })
  grupoLabor: GrupoLabor;

} 