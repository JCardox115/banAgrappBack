import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ImportacionesService } from './importaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('importaciones')
// @UseGuards(JwtAuthGuard)
export class ImportacionesController {
  constructor(private readonly importacionesService: ImportacionesService) {}

  @Post(':entityName')
  async importData(
    @Body() data: any[],
    @Param('entityName') entityName: string
  ) {
    console.log('Importando datos para la entidad:', entityName);
    return this.importacionesService.importData(entityName, data);
  }
} 