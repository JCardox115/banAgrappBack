import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRegistroLaborDetalleDto {
  @IsNotEmpty()
  @IsNumber()
  registroLaborId: number;

  @IsOptional()
  @IsNumber()
  loteId?: number;

  @IsOptional()
  @IsString()
  loteNumero?: string;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsNumber()
  areaRealizada?: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsNumber()
  recargo?: number;

  @IsOptional()
  @IsNumber()
  semanasEjecutadas?: number;
} 