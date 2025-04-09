import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { CreateLaborGrupoLaborDto } from './dto/create-labor-grupo-labor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateLaborGrupoLaborDto } from './dto/update-labor-grupo-labor.dto';
import { LaborGrupoLaborService } from './labor-grupo-labor.service';

@Controller('labor-grupo-labor')
@UseGuards(JwtAuthGuard)
export class LaborGrupoLaborController {
  constructor(private readonly laborGrupoLaborService: LaborGrupoLaborService) {}

  @Post()
  create(@Body() createLaborGrupoLaborDto: CreateLaborGrupoLaborDto) {
    return this.laborGrupoLaborService.create(createLaborGrupoLaborDto);
  }

  @Get()
  findAll() {
    return this.laborGrupoLaborService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laborGrupoLaborService.findOne(+id);
  }

  @Get('by-grupo/:idGrupoLabor')
  findByGrupo(@Param('idGrupoLabor') idGrupoLabor: string) {
    return this.laborGrupoLaborService.findByGrupo(+idGrupoLabor);
  }

  @Get('by-labor/:idLabor')
  findByLabor(@Param('idLabor') idLabor: string) {
    return this.laborGrupoLaborService.findByLabor(+idLabor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaborGrupoLaborDto: UpdateLaborGrupoLaborDto) {
    return this.laborGrupoLaborService.update(+id, updateLaborGrupoLaborDto);
  }
  
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateLaborGrupoLaborDto: UpdateLaborGrupoLaborDto) {
    return this.laborGrupoLaborService.update(+id, updateLaborGrupoLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laborGrupoLaborService.remove(+id);
  }
}