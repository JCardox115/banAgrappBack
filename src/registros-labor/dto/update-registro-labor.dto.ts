import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroLaborDto } from './create-registro-labor.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateRegistroLaborDto extends PartialType(CreateRegistroLaborDto) {
    @IsNotEmpty()
    id: number;
} 