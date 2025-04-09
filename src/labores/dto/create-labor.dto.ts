import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateLaborDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsBoolean()
  laborPrincipal?: boolean;

  @IsNotEmpty()
  @IsNumber()
  lugarEjecucionId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 