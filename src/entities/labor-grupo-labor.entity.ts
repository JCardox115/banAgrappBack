import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
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
  @JoinColumn({ name: 'idLabor' })  // Se le indica a TypeORM que "idLabor" es la FK para la entidad Labor.
  labor: Labor;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'idGrupoLabor' })  // De igual forma para grupoLabor.
  grupoLabor: Grupo;
} 