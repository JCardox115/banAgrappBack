import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoLabor } from '../entities/grupo-labor.entity';
import { GruposLaborController } from './grupos-labor.controller';
import { GruposLaborService } from './grupos-labor.service';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoLabor])],
  controllers: [GruposLaborController],
  providers: [GruposLaborService],
  exports: [GruposLaborService]
})
export class GruposLaborModule {} 