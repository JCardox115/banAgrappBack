import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLaborFincaDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  codigo: string;

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