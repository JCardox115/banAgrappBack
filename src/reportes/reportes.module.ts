import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { RegistroLaborDetalle } from '../entities/registro-labor-detalle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroLabor, RegistroLaborDetalle]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService]
})
export class ReportesModule {} 