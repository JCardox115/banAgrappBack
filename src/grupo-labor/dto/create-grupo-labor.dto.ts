import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateGrupoLaborDto {
  @IsNumber()
  idLabor: number;

  @IsNumber()
  idGrupo: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
} 