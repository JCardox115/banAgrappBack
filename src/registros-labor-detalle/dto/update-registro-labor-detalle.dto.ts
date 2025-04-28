import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroLaborDetalleDto } from './create-registro-labor-detalle.dto';

export class UpdateRegistroLaborDetalleDto extends PartialType(CreateRegistroLaborDetalleDto) {} 