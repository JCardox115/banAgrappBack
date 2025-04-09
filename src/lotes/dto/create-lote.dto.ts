import { IsNotEmpty, IsString, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateLoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numLote: string;

  @IsNumber()
  @IsNotEmpty()
  fincaId: number;

  @IsNumber()
  @IsNotEmpty()
  tipoSueloId: number;

  @IsNumber()
  @IsNotEmpty()
  hectareasNetas: number;

  @IsOptional()
  activo?: boolean;
} 