import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LaborFinca } from './labor-finca.entity';
import { UnidadMedida } from './unidad-medida.entity';
import { LugarEjecucion } from './lugar-ejecucion.entity';

@Entity('labores')
export class Labor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string;

  @Column({ default: false })
  variable: boolean;

  @ManyToOne(() => UnidadMedida)
  unidadMedida: UnidadMedida;

  @ManyToOne(() => LugarEjecucion)
  lugarEjecucion: LugarEjecucion;

  @Column({ nullable: true })
  numVueltasSemanales: number;

  @Column()
  zona: string;

  @Column()
  descZona: string;

  @Column({ type: 'date' })
  fechaVigencia: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ default: false })
  enBloque: boolean;

  @Column({ default: false })
  aplicaRecargo: boolean;

  @OneToMany(() => LaborFinca, laborFinca => laborFinca.labor)
  laboresFinca: LaborFinca[];

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 