// backend/src/fincas/dto/create-finca.dto.ts
import { IsNotEmpty, IsString, IsBoolean, MaxLength, IsOptional, IsDate } from 'class-validator';
import { CentroCosto } from 'src/entities/centro-costo.entity';
import { Lote } from 'src/entities/lote.entity';

export class CreateFincaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  descripcion: string;

  @IsOptional()
  createdAt: string;

@IsOptional()
  updateDate: string;


  @IsOptional()
  centrosCosto: CentroCosto[];

  @IsOptional()
  lotes: Lote[];


  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}