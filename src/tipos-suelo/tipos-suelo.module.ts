import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSuelo } from 'src/entities/tipo-suelo.entity';
import { TiposSueloService } from './tipos-suelo.service';
import { TiposSueloController } from './tipos-suelo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSuelo])],
  controllers: [TiposSueloController],
  providers: [TiposSueloService],
})
export class TiposSueloModule {}