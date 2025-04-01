import { PartialType } from '@nestjs/mapped-types';
import { CreateLaborFincaDto } from './create-labor-finca.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateLaborFincaDto extends PartialType(CreateLaborFincaDto) {

  @IsNotEmpty()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 