import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateCentroCostoDto {
  @IsNumber()
  @IsNotEmpty()
  id?: number;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsOptional()
  fincaId?: number;
} 