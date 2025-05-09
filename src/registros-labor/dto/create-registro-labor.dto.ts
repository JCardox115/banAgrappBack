import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { TipoRegistro } from '../../entities/registro-labor.entity';

export class CreateRegistroLaborDto {
  @IsNotEmpty()
  @IsNumber()
  empleadoId: number;

  @IsNotEmpty()
  @IsNumber()
  conceptoPagoGrupoLaborId: number;

  @IsNotEmpty()
  centroCostoId: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsOptional()
  valorUnitario?: number;

  @IsOptional()
  @IsNumber()
  
  total?: number;

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

  @IsNotEmpty()
  @IsEnum(TipoRegistro)
  tipoRegistro: TipoRegistro;
}