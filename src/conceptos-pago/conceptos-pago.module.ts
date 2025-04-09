import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptoPago } from '../entities/concepto-pago.entity';
import { ConceptosPagoController } from './conceptos-pago.controller';
import { ConceptosPagoService } from './conceptos-pago.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConceptoPago])],
  controllers: [ConceptosPagoController],
  providers: [ConceptosPagoService],
  exports: [ConceptosPagoService]
})
export class ConceptosPagoModule {} 