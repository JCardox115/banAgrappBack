import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, ParseIntPipe, Optional } from '@nestjs/common';
import { GruposLaborService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('grupos')
@UseGuards(JwtAuthGuard)
export class GruposLaborController {
  constructor(private readonly gruposLaborService: GruposLaborService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.gruposLaborService.create(createGrupoDto);
  }

  @Get()
  findAll(@Query('fincaId') fincaId?: string) {
    return this.gruposLaborService.findAll(fincaId ? parseInt(fincaId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gruposLaborService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGrupoLaborDto: UpdateGrupoDto) {
    return this.gruposLaborService.update(id, updateGrupoLaborDto);
  }

  @Put(':id')
  updatePut(@Param('id', ParseIntPipe) id: number, @Body() updateGrupoLaborDto: UpdateGrupoDto) {
    return this.gruposLaborService.update(id, updateGrupoLaborDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gruposLaborService.remove(id);
  }
} 