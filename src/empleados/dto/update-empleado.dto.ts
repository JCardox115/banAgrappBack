import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {
  @IsNumber()
  @IsNotEmpty()
  id?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
} 