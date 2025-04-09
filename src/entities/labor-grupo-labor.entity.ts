import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ConceptoPagoLaborGrupoLabor } from './concepto-pago-labor-grupo-labor.entity';
import { Labor } from './labor.entity';
import { Grupo } from './grupo.entity';

@Entity('labor_grupo_labor')
export class LaborGrupoLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idLabor: number;

  @Column()
  idGrupoLabor: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  dateUpdate: Date;

  @OneToMany(() => ConceptoPagoLaborGrupoLabor, conceptoPagoLaborGrupoLabor => conceptoPagoLaborGrupoLabor.laborGrupoLabor)
  conceptoPagoLaborGrupoLabor: ConceptoPagoLaborGrupoLabor[];

  @ManyToOne(() => Labor)
  labor: Labor;

  @ManyToOne(() => Grupo)
  grupoLabor: Grupo; 
} 