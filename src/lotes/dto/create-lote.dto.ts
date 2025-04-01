import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLoteDto {
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
  fincaId: number;

  @IsNotEmpty()
  @IsNumber()
  hectareasNetas: number;

  @IsOptional()
  @IsNumber()
  tipoSueloId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 