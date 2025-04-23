import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsObject, IsDate } from 'class-validator';
import { UnidadMedida } from 'src/entities/unidad-medida.entity';

export class CreateConceptoPagoDto {

  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  codigo: number;

  @IsNotEmpty()
  @IsString()
  descripcion: string;
  
  @IsOptional()
  @IsNumber()
  unidadMedidaId?: number;

  @IsNotEmpty()
  precio: number;

  @IsOptional()
  @IsObject()
  unidadMedida: UnidadMedida;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 