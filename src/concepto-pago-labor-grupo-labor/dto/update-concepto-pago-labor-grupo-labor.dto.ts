import { PartialType } from '@nestjs/mapped-types';
import { CreateConceptoPagoLaborGrupoLaborDto } from './create-concepto-pago-labor-grupo-labor.dto';

export class UpdateConceptoPagoLaborGrupoLaborDto extends PartialType(CreateConceptoPagoLaborGrupoLaborDto) {} 