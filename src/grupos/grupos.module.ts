import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from '../entities/grupo.entity';
import { GruposLaborController } from './grupos.controller';
import { GruposLaborService } from './grupos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo])],
  controllers: [GruposLaborController],
  providers: [GruposLaborService],
  exports: [GruposLaborService]
})
export class GruposLaborModule {} 