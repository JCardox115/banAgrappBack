import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateUnidadMedidaDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsOptional() // Cambia esto a @IsBoolean() si es necesario
  @IsBoolean()
  activo?: boolean; // Este campo puede ser opcional
}