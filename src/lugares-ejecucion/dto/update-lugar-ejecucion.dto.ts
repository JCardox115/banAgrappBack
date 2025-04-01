import { PartialType } from '@nestjs/mapped-types';
import { CreateLugarEjecucionDto } from './create-lugar-ejecucion.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLugarEjecucionDto extends PartialType(CreateLugarEjecucionDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 