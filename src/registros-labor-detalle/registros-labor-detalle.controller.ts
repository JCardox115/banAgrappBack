import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RegistrosLaborDetalleService } from './registros-labor-detalle.service';
import { CreateRegistroLaborDetalleDto } from './dto/create-registro-labor-detalle.dto';
import { UpdateRegistroLaborDetalleDto } from './dto/update-registro-labor-detalle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('registros-labor-detalle')
@UseGuards(JwtAuthGuard)
export class RegistrosLaborDetalleController {
  constructor(private readonly registrosLaborDetalleService: RegistrosLaborDetalleService) {}

  @Post()
  create(@Body() createRegistroLaborDetalleDto: CreateRegistroLaborDetalleDto) {
    return this.registrosLaborDetalleService.create(createRegistroLaborDetalleDto);
  }

  @Post('bulk')
  createBulk(@Body('detalles') detalles: CreateRegistroLaborDetalleDto[]) {
    return this.registrosLaborDetalleService.createBulk(detalles);
  }

  @Get()
  findAll() {
    return this.registrosLaborDetalleService.findAll();
  }

  @Get('by-registro/:registroLaborId')
  findByRegistroLabor(@Param('registroLaborId') registroLaborId: number) {
    return this.registrosLaborDetalleService.findByRegistroLabor(registroLaborId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.registrosLaborDetalleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRegistroLaborDetalleDto: UpdateRegistroLaborDetalleDto) {
    return this.registrosLaborDetalleService.update(id, updateRegistroLaborDetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.registrosLaborDetalleService.remove(id);
  }

  @Delete('by-registro/:registroLaborId')
  removeByRegistroLabor(@Param('registroLaborId') registroLaborId: number) {
    return this.registrosLaborDetalleService.removeByRegistroLabor(registroLaborId);
  }
} 