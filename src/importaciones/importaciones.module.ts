import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportacionesController } from './importaciones.controller';
import { ImportacionesService } from './importaciones.service';
import { Labor } from '../entities/labor.entity';
import { Empleado } from '../entities/empleado.entity';
import { Lote } from '../entities/lote.entity';
import { CentroCosto } from '../entities/centro-costo.entity';
import { UnidadMedida } from '../entities/unidad-medida.entity';
import { LugarEjecucion } from '../entities/lugar-ejecucion.entity';
import { TipoSuelo } from '../entities/tipo-suelo.entity';
import { GrupoLabor } from '../entities/grupo-labor.entity';
import { ConceptoPago } from '../entities/concepto-pago.entity';
import { ConceptoPagoGrupoLabor } from '../entities/concepto-pago-grupo-labor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Labor,
      Empleado,
      Lote,
      CentroCosto,
      UnidadMedida,
      LugarEjecucion,
      TipoSuelo,
      GrupoLabor,
      ConceptoPago,
      ConceptoPagoGrupoLabor
    ])
  ],
  controllers: [ImportacionesController],
  providers: [ImportacionesService],
  exports: [ImportacionesService]
})
export class ImportacionesModule {} 