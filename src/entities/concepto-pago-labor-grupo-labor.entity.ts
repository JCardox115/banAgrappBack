import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { RegistroLabor } from './registro-labor.entity';
import { Labor } from './labor.entity';
import { ConceptoPago } from './concepto-pago.entity';
import { Grupo } from './grupo.entity';
import { Finca } from './finca.entity';
import { UnidadMedida } from './unidad-medida.entity';
import { LaborGrupoLabor } from './labor-grupo-labor.entity';
@Entity('concepto_pago_labor_grupo_labor')
export class ConceptoPagoLaborGrupoLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idConceptoPago: number;

  @Column()
  idLaborGrupoLabor: number;

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