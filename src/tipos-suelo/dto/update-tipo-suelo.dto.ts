import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoSueloDto } from './create-tipo-suelo.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTipoSueloDto extends PartialType(CreateTipoSueloDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
} 