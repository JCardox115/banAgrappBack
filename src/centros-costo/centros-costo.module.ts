import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentrosCostoController } from './centros-costo.controller';
import { CentrosCostoService } from './centros-costo.service';
import { CentroCosto } from '../entities/centro-costo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CentroCosto]),
    AuthModule,
  ],
  controllers: [CentrosCostoController],
  providers: [CentrosCostoService],
  exports: [CentrosCostoService],
})
export class CentrosCostoModule {} 