import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateLaborGrupoLaborDto {
  @IsNumber()
  idLabor: number;

  @IsNumber()
  idGrupoLabor: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
} 