import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { ConceptoPagoGrupoLabor } from './concepto-pago-grupo-labor.entity';
import { Labor } from './labor.entity';
import { Grupo } from './grupo.entity';

@Entity('grupo_labor')
export class GrupoLabor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idLabor: number;

  @Column()
  idGrupo: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ConceptoPagoGrupoLabor, conceptoPagoGrupoLabor => conceptoPagoGrupoLabor.grupoLabor)
  conceptoPagoGrupoLabor: ConceptoPagoGrupoLabor[];

  @ManyToOne(() => Labor)
  @JoinColumn({ name: 'idLabor' })  // Se le indica a TypeORM que "idLabor" es la FK para la entidad Labor.
  labor: Labor;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'idGrupo' })  // De igual forma para grupoLabor.
  grupo: Grupo;
} 