import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateGrupoLaborDto } from './dto/update-grupo-labor.dto';
import { CreateGrupoLaborDto } from './dto/create-grupo-labor.dto';
import { GrupoLaborService } from './grupo-labor.service';

@Controller('grupo-labor')
@UseGuards(JwtAuthGuard)
export class GrupoLaborController {
  constructor(private readonly laborGrupoLaborService: GrupoLaborService) {}

  @Post()
  create(@Body() createGrupoLaborDto: CreateGrupoLaborDto) {
    return this.laborGrupoLaborService.create(createGrupoLaborDto);
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
  update(@Param('id') id: string, @Body() updateGrupoLaborDto: UpdateGrupoLaborDto) {
    return this.laborGrupoLaborService.update(+id, updateGrupoLaborDto);
  }
  
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateGrupoLaborDto: UpdateGrupoLaborDto) {
    return this.laborGrupoLaborService.update(+id, updateGrupoLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laborGrupoLaborService.remove(+id);
  }
}