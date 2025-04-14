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

  @IsNotEmpty()
  hectareasNetas: number;

  @IsString()
  creationDate: string;

  @IsString()
  updateDate: string;

  @IsOptional()
  activo?: boolean;
} 