import { IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateConceptoPagoLaborGrupoLaborDto {
  @IsNotEmpty()
  @IsNumber()
  idConceptoPago: number;

  @IsNotEmpty()
  @IsNumber()
  idLaborGrupoLabor: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 