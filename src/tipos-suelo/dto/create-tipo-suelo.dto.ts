import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateTipoSueloDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  descripcion: string;

  @IsOptional()
  activo?: boolean;
} 