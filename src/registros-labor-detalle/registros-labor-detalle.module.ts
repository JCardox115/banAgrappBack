import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrosLaborDetalleService } from './registros-labor-detalle.service';
import { RegistrosLaborDetalleController } from './registros-labor-detalle.controller';
import { RegistroLaborDetalle } from '../entities/registro-labor-detalle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroLaborDetalle])],
  controllers: [RegistrosLaborDetalleController],
  providers: [RegistrosLaborDetalleService],
  exports: [RegistrosLaborDetalleService]
})
export class RegistrosLaborDetalleModule {} 