import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { RegistrosLaborService } from './registros-labor.service';
import { CreateRegistroLaborDto } from './dto/create-registro-labor.dto';
import { UpdateRegistroLaborDto } from './dto/update-registro-labor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('registros-labor')
@UseGuards(JwtAuthGuard)
export class RegistrosLaborController {
  constructor(private readonly registrosLaborService: RegistrosLaborService) {}

  @Post()
  create(@Body() createRegistroLaborDto: CreateRegistroLaborDto) {
    return this.registrosLaborService.create(createRegistroLaborDto);
  }

  @Post('with-detalles')
  createWithDetalles(
    @Body('registro') createRegistroLaborDto: CreateRegistroLaborDto,
    @Body('detalles') detalles: any[]
  ) {
    return this.registrosLaborService.createWithDetalles(createRegistroLaborDto, detalles);
  }

  @Post('bulk')
  createBulk(@Body('registros') registros: CreateRegistroLaborDto[]) {
    return this.registrosLaborService.createBulk(registros);
  }

  @Get()
  findAll(@Query('fincaId') fincaId?: number) {
    return this.registrosLaborService.findAll(fincaId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.registrosLaborService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRegistroLaborDto: UpdateRegistroLaborDto) {
    return this.registrosLaborService.update(id, updateRegistroLaborDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: number, @Body() updateRegistroLaborDto: UpdateRegistroLaborDto) {
    return this.registrosLaborService.update(id, updateRegistroLaborDto);
  }

  @Patch(':id/with-detalles')
  updateWithDetalles(
    @Param('id') id: number,
    @Body('registro') updateRegistroLaborDto: UpdateRegistroLaborDto,
    @Body('detalles') detalles: any[]
  ) {
    return this.registrosLaborService.updateWithDetalles(id, updateRegistroLaborDto, detalles);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.registrosLaborService.remove(id);
  }
} 