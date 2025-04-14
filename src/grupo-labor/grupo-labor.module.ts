import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoLabor } from '../entities/grupo-labor.entity';
import { GrupoLaborService } from './grupo-labor.service';
import { GrupoLaborController } from './grupo-labor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoLabor])],
  controllers: [GrupoLaborController],
  providers: [GrupoLaborService],
  exports: [GrupoLaborService]
})
export class GrupoLaborModule {} 