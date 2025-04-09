import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { CreateTipoSueloDto } from './dto/create-tipo-suelo.dto';
import { UpdateTipoSueloDto } from './dto/update-tipo-suelo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TiposSueloService } from './tipos-suelo.service';

@Controller('tipos-suelo')
@UseGuards(JwtAuthGuard)
export class TiposSueloController {
  constructor(private readonly tiposSueloService: TiposSueloService) {}

  @Post()
  create(@Body() createTipoSueloDto: CreateTipoSueloDto) {
    return this.tiposSueloService.create(createTipoSueloDto);
  }

  @Get()
  findAll() {
    return this.tiposSueloService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposSueloService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoSueloDto: UpdateTipoSueloDto) {
    return this.tiposSueloService.update(+id, updateTipoSueloDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateTipoSueloDto: UpdateTipoSueloDto) {
    return this.tiposSueloService.update(+id, updateTipoSueloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposSueloService.remove(+id);
  }
} 