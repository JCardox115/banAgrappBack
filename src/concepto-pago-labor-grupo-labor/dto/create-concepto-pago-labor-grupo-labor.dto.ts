import { IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateConceptoPagoLaborGrupoLaborDto {
  @IsNotEmpty()
  @IsNumber()
  conceptoPagoId: number;

  @IsNotEmpty()
  @IsNumber()
  laborGrupoLaborId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 