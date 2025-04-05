import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateGrupoLaborDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  fincaId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 