import { IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateConceptoPagoGrupoLaborDto {
  @IsNotEmpty()
  @IsNumber()
  conceptoPagoId: number;

  @IsNotEmpty()
  @IsNumber()
  grupoLaborId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 