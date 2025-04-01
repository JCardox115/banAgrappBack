import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LugarEjecucion } from '../entities/lugar-ejecucion.entity';
import { LugaresEjecucionController } from './lugares-ejecucion.controller';
import { LugaresEjecucionService } from './lugares-ejecucion.service';

@Module({
  imports: [TypeOrmModule.forFeature([LugarEjecucion])],
  controllers: [LugaresEjecucionController],
  providers: [LugaresEjecucionService],
  exports: [LugaresEjecucionService]
})
export class LugaresEjecucionModule {} 