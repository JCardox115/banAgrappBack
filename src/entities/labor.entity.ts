import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UnidadMedida } from './unidad-medida.entity';
import { LugarEjecucion } from './lugar-ejecucion.entity';
import { IsOptional } from 'class-validator';

@Entity('labores')
export class Labor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @Column({ default: false })
  laborPrincipal: boolean;

  @ManyToOne(() => LugarEjecucion)
  lugarEjecucion: LugarEjecucion;

  @Column({ default: false })
  rendimientoCalculado: boolean;

  @Column({ nullable: true })
  @IsOptional()
  rendimientoEstandar: number;

  @Column({ nullable: true })
  @IsOptional()
  numeroVueltasSemanales: number;

  @Column({ default: false })
  convertirA20K: boolean;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  dateUpdate: Date;
} 