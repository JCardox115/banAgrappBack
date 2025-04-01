import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroLaborDto } from './create-registro-labor.dto';

export class UpdateRegistroLaborDto extends PartialType(CreateRegistroLaborDto) {} 