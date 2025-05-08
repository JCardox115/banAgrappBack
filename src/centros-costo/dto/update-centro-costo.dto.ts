import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { CreateCentroCostoDto } from './create-centro-costo.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCentroCostoDto extends PartialType(CreateCentroCostoDto) {
  @IsNumber()
  @IsNotEmpty()
  id?: number;
}
