import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { RegistroLabor } from './registro-labor.entity';
import { ConceptoPago } from './concepto-pago.entity';
import { LaborGrupoLabor } from './labor-grupo-labor.entity';
import { IsOptional } from 'class-validator';
@Entity('concepto_pago_labor_grupo_labor')
export class ConceptoPagoLaborGrupoLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsOptional()
  conceptoPagoId?: number;

  @Column()
  @IsOptional()
  laborGrupoLaborId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  dateUpdate: Date;

  @OneToMany(() => RegistroLabor, registroLabor => registroLabor.conceptoPagoLaborGrupoLabor)
  registrosLabor: RegistroLabor[];

  @ManyToOne(() => ConceptoPago)
  conceptoPago: ConceptoPago;

  @ManyToOne(() => LaborGrupoLabor)
  laborGrupoLabor: LaborGrupoLabor;

} 