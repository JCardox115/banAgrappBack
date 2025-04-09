import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborGrupoLabor } from '../entities/labor-grupo-labor.entity';
import { LaborGrupoLaborService } from './labor-grupo-labor.service';
import { LaborGrupoLaborController } from './labor-grupo-labor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LaborGrupoLabor])],
  controllers: [LaborGrupoLaborController],
  providers: [LaborGrupoLaborService],
  exports: [LaborGrupoLaborService]
})
export class LaborGrupoLaborModule {} 