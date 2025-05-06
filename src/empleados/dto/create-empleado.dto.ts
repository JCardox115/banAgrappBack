import { IsNotEmpty, IsString, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateEmpleadoDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsString()
  numDocumento: string;

  @IsNotEmpty()
  @IsEnum(['M', 'F'])
  genero: string;

  @IsNotEmpty()
  @IsEnum(['Operativo', 'Oficina'])
  tipo: string;

  @IsNotEmpty()
  @IsDateString()
  fechaNacimiento: string;

  @IsNotEmpty()
  @IsDateString()
  fechaIngresoFinca: string;

  @IsNotEmpty()
  @IsNumber()
  fincaId: number;

  @IsBoolean()
  activo?: boolean; // Cambia esto a @IsBoolean() si es necesario

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}