import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Labor } from '../entities/labor.entity';
import { LaboresController } from './labores.controller';
import { LaboresService } from './labores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Labor])],
  controllers: [LaboresController],
  providers: [LaboresService],
  exports: [LaboresService]
})
export class LaboresModule {} 