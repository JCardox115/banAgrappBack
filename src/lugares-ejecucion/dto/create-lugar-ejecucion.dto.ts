import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLugarEjecucionDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  activo: boolean;
} 