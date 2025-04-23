import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsDate } from 'class-validator';
  
export class CreateGrupoDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  fincaId: number;

  @IsOptional()
  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 