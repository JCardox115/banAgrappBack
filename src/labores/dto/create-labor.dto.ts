import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateLaborDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  
  @IsOptional()
  @IsNumber()
  codigo?: number;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsBoolean()
  laborPrincipal?: boolean;

  @IsNotEmpty()
  @IsNumber()
  lugarEjecucionId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 