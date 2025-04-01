import { PartialType } from '@nestjs/mapped-types';
import { CreateLoteDto } from './create-lote.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLoteDto extends PartialType(CreateLoteDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 