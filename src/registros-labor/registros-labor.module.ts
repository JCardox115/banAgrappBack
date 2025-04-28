import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { RegistrosLaborController } from './registros-labor.controller';
import { RegistrosLaborService } from './registros-labor.service';
import { RegistrosLaborDetalleModule } from '../registros-labor-detalle/registros-labor-detalle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroLabor]),
    RegistrosLaborDetalleModule
  ],
  controllers: [RegistrosLaborController],
  providers: [RegistrosLaborService],
  exports: [RegistrosLaborService]
})
export class RegistrosLaborModule {} 