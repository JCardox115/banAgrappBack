import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRegistroLaborDto {
  @IsNotEmpty()
  @IsNumber()
  empleadoId: number;

  @IsNotEmpty()
  @IsNumber()
  conceptoPagoLaborGrupoLaborId: number;

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
  @IsNumber()
  valorUnitario: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  detalleCantidad?: string;

  @IsNotEmpty()
  @IsNumber()
  anio: number;

  @IsNotEmpty()
  @IsNumber()
  semana: number;

  @IsOptional()
  @IsNumber()
  recargo?: number;

  @IsOptional()
  @IsNumber()
  horas?: number;

  @IsOptional()
  @IsNumber()
  semanasEjecutadas?: number;

  @IsOptional()
  @IsNumber()
  loteId?: number;

  @IsOptional()
  @IsNumber()
  cantidadLote?: number;
}