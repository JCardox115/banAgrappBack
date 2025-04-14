import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptoPagoGrupoLabor } from '../entities/concepto-pago-grupo-labor.entity';
import { ConceptoPagoGrupoLaborController } from './concepto-pago-grupo-labor.controller';
import { ConceptoPagoGrupoLaborService } from './concepto-pago-grupo-labor.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConceptoPagoGrupoLabor])],
  controllers: [ConceptoPagoGrupoLaborController],
  providers: [ConceptoPagoGrupoLaborService],
  exports: [ConceptoPagoGrupoLaborService]
})
export class ConceptoPagoGrupoLaborModule {} 