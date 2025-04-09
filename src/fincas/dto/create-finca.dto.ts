// backend/src/fincas/dto/create-finca.dto.ts
import { IsNotEmpty, IsString, IsBoolean, MaxLength, IsOptional, IsDate } from 'class-validator';

export class CreateFincaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  descripcion: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}