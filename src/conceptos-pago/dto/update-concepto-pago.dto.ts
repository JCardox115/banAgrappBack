import { PartialType } from '@nestjs/mapped-types';
import { CreateConceptoPagoDto } from './create-concepto-pago.dto';

export class UpdateConceptoPagoDto extends PartialType(CreateConceptoPagoDto) {} 