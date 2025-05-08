import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Finca } from 'src/entities/finca.entity';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateCentroCostoDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsBoolean()
  @IsOptional()
  isPrincipal?: boolean;

  @IsOptional()
  fincaId: number;

  @IsOptional()
  finca: Finca;
} 