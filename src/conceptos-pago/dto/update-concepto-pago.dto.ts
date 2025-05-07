import { PartialType } from '@nestjs/mapped-types';
import { CreateConceptoPagoDto } from './create-concepto-pago.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateConceptoPagoDto extends PartialType(CreateConceptoPagoDto) {
    @IsOptional()
    @IsNumber()
    fincaId?: number;
} 