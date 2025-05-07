import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from '../entities/grupo.entity';
import { GruposController } from './grupos.controller';
import { GruposService } from './grupos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo])],
  controllers: [GruposController],
  providers: [GruposService],
  exports: [GruposService]
})
export class GruposModule {} 