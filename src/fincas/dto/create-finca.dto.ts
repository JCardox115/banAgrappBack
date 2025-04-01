// backend/src/fincas/dto/create-finca.dto.ts
import { IsNotEmpty, IsString, IsBoolean, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateFincaDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  descripcion: string;

  @IsBoolean()
  activo?: boolean; // Este campo puede ser opcional
}