import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoLaborDto } from './create-grupo-labor.dto';

export class UpdateGrupoLaborDto extends PartialType(CreateGrupoLaborDto) {} 