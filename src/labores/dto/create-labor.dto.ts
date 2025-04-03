import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLaborDto {

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsBoolean()
  variable?: boolean;

  @IsNotEmpty()
  @IsNumber()
  unidadMedidaId: number;

  @IsNotEmpty()
  @IsNumber()
  lugarEjecucionId: number;

  @IsOptional()
  @IsNumber()
  numVueltasSemanales?: number;

  @IsNotEmpty()
  @IsString()
  zona: string;

  @IsNotEmpty()
  @IsString()
  descZona: string;

  @IsNotEmpty()
  @IsDateString()
  fechaVigencia: string;

  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @IsOptional()
  @IsBoolean()
  enBloque?: boolean;

  @IsOptional()
  @IsBoolean()
  aplicaRecargo?: boolean;
} 