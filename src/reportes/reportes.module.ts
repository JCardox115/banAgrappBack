import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { RegistroLabor } from '../entities/registro-labor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroLabor])],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {} 