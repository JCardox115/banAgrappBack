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

  @IsNotEmpty()
  @IsNumber()
  grupoLaborId: number;

  @IsNotEmpty()
  @IsString()
  variable: string;

  @IsNotEmpty()
  @IsNumber()
  unidadMedidaId: number;

  @IsOptional()
  @IsBoolean()
  laborPrincipal?: boolean;

  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @IsNotEmpty()
  @IsNumber()
  lugarEjecucionId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 