import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRegistroLaborDto {
  @IsNotEmpty()
  @IsNumber()
  empleadoId: number;

  @IsNotEmpty()
  @IsNumber()
  laborFincaId: number;

  @IsNotEmpty()
  @IsNumber()
  centroCostoId: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  valorUnitario: number;

  @IsNotEmpty()
  total: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  loteId?: number;

  @IsOptional()
  @IsNumber()
  cantidadLote?: number;
} 