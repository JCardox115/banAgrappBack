import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Finca } from '../entities/finca.entity';
import { UserFincaService } from './user-finca.service';
import { UserFincaController } from './user-finca.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Finca])],
  controllers: [UserFincaController],
  providers: [UserFincaService],
  exports: [UserFincaService]
})
export class UserFincaModule {} 