import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LugaresEjecucionService } from './lugares-ejecucion.service';
import { CreateLugarEjecucionDto } from './dto/create-lugar-ejecucion.dto';
import { UpdateLugarEjecucionDto } from './dto/update-lugar-ejecucion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lugares-ejecucion')
@UseGuards(JwtAuthGuard)
export class LugaresEjecucionController {
  constructor(private readonly lugaresEjecucionService: LugaresEjecucionService) {}

  @Post()
  create(@Body() createLugarEjecucionDto: CreateLugarEjecucionDto) {
    return this.lugaresEjecucionService.create(createLugarEjecucionDto);
  }

  @Get()
  findAll() {
    return this.lugaresEjecucionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.lugaresEjecucionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLugarEjecucionDto: UpdateLugarEjecucionDto) {
    return this.lugaresEjecucionService.update(id, updateLugarEjecucionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.lugaresEjecucionService.remove(id);
  }
} 