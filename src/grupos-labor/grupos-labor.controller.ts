import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GruposLaborService } from './grupos-labor.service';
import { CreateGrupoLaborDto } from './dto/create-grupo-labor.dto';
import { UpdateGrupoLaborDto } from './dto/update-grupo-labor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('grupos-labor')
@UseGuards(JwtAuthGuard)
export class GruposLaborController {
  constructor(private readonly gruposLaborService: GruposLaborService) {}

  @Post()
  create(@Body() createGrupoLaborDto: CreateGrupoLaborDto) {
    return this.gruposLaborService.create(createGrupoLaborDto);
  }

  @Get()
  findAll(@Query('fincaId') fincaId?: number) {
    return this.gruposLaborService.findAll(fincaId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gruposLaborService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGrupoLaborDto: UpdateGrupoLaborDto) {
    return this.gruposLaborService.update(id, updateGrupoLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gruposLaborService.remove(id);
  }
} 