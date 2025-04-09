import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseIntPipe } from '@nestjs/common';
import { LaboresService } from './labores.service';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Labor } from 'src/entities/labor.entity';

@Controller('labores')
@UseGuards(JwtAuthGuard)
export class LaboresController {
  constructor(private readonly laboresService: LaboresService) {}

  @Post()
  create(@Body() createLaborDto: CreateLaborDto) {
    return this.laboresService.create(createLaborDto);
  }

  @Get()
  findAll() {
    return this.laboresService.findAll();
  }

  @Get('grupo/:grupoId')
  findByGrupo(@Param('grupoId') grupoId: number) {
    return this.laboresService.findByGrupo(grupoId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Labor> {
    return this.laboresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLaborDto: UpdateLaborDto) {
    return this.laboresService.update(id, updateLaborDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: number, @Body() updateLaborDto: UpdateLaborDto) {
    return this.laboresService.update(id, updateLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.laboresService.remove(id);
  }
} 