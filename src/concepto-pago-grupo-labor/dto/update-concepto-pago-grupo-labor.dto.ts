import { PartialType } from '@nestjs/mapped-types';
import { CreateConceptoPagoGrupoLaborDto } from './create-concepto-pago-grupo-labor.dto';

export class UpdateConceptoPagoGrupoLaborDto extends PartialType(CreateConceptoPagoGrupoLaborDto) {} 