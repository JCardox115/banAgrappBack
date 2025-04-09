import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsObject, IsDate } from 'class-validator';
import { UnidadMedida } from 'src/entities/unidad-medida.entity';

export class CreateConceptoPagoDto {

  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  codigo: string;

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
  creationDate: Date;

  @IsOptional()
  dateUpdate: Date;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 