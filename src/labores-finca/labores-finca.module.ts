import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborFinca } from '../entities/labor-finca.entity';
import { LaboresFincaController } from './labores-finca.controller';
import { LaboresFincaService } from './labores-finca.service';


@Module({
  imports: [TypeOrmModule.forFeature([LaborFinca])],
  controllers: [LaboresFincaController],
  providers: [LaboresFincaService],
  exports: [LaboresFincaService]
})
export class LaboresFincaModule {}
