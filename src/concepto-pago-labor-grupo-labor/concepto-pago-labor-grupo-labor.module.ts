import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptoPagoLaborGrupoLabor } from '../entities/concepto-pago-labor-grupo-labor.entity';
import { ConceptoPagoLaborGrupoLaborController } from './concepto-pago-labor-grupo-labor.controller';
import { ConceptoPagoLaborGrupoLaborService } from './concepto-pago-labor-grupo-labor.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConceptoPagoLaborGrupoLabor])],
  controllers: [ConceptoPagoLaborGrupoLaborController],
  providers: [ConceptoPagoLaborGrupoLaborService],
  exports: [ConceptoPagoLaborGrupoLaborService]
})
export class ConceptoPagoLaborGrupoLaborModule {} 