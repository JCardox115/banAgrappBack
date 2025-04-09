import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tipos_suelo')
export class TipoSuelo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: false })
  codigo: string;

  @Column({ length: 100, nullable: false })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate: Date;
} 