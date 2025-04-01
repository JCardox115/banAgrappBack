import { PartialType } from '@nestjs/mapped-types';
import { CreateLaborDto } from './create-labor.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLaborDto extends PartialType(CreateLaborDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 