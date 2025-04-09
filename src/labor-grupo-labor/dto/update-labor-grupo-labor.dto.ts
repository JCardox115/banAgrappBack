import { PartialType } from '@nestjs/mapped-types';
import { CreateLaborGrupoLaborDto } from './create-labor-grupo-labor.dto';

export class UpdateLaborGrupoLaborDto extends PartialType(CreateLaborGrupoLaborDto) {} 