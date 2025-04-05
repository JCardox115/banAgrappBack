import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLaborFincaDto {
  @IsNotEmpty()
  @IsNumber()
  laborId: number;
  
  @IsNotEmpty()
  @IsNumber()
  fincaId: number;
  
  @IsNotEmpty()
  @IsNumber()
  precio: number;
  
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 