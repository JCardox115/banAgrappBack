import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLaborFincaDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  laborId: number;

  @IsNotEmpty()
  @IsNumber()
  fincaId: number;

  @IsNotEmpty()
  precioEspecifico: number;

  @IsNotEmpty()
  @IsBoolean()
  activo: boolean;
} 