import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { RegistrosLaborController } from './registros-labor.controller';
import { RegistrosLaborService } from './registros-labor.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroLabor])],
  controllers: [RegistrosLaborController],
  providers: [RegistrosLaborService],
  exports: [RegistrosLaborService]
})
export class RegistrosLaborModule {} 