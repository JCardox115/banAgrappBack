import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LaborFinca } from './labor-finca.entity';
import { UnidadMedida } from './unidad-medida.entity';
import { LugarEjecucion } from './lugar-ejecucion.entity';
import { GrupoLabor } from './grupo-labor.entity';

@Entity('labores')
export class Labor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => GrupoLabor, grupoLabor => grupoLabor.labores)
  grupoLabor: GrupoLabor;

  @Column()
  variable: string;

  @ManyToOne(() => UnidadMedida)
  unidadMedida: UnidadMedida;

  @Column({ default: false })
  laborPrincipal: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @ManyToOne(() => LugarEjecucion)
  lugarEjecucion: LugarEjecucion;

  @OneToMany(() => LaborFinca, laborFinca => laborFinca.labor)
  laboresFinca: LaborFinca[];

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 