import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LaboresFincaService } from './labores-finca.service';
import { CreateLaborFincaDto } from './dto/create-labor-finca.dto';
import { UpdateLaborFincaDto } from './dto/update-labor-finca.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('labores-finca')
@UseGuards(JwtAuthGuard)
export class LaboresFincaController {
  constructor(private readonly laboresFincaService: LaboresFincaService) {}

  @Post()
  create(@Body() createLaborFincaDto: CreateLaborFincaDto) {
    return this.laboresFincaService.create(createLaborFincaDto);
  }

  @Get()
  findAll(@Query('fincaId') fincaId?: number) {
    return this.laboresFincaService.findAll(fincaId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.laboresFincaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLaborFincaDto: UpdateLaborFincaDto) {
    return this.laboresFincaService.update(id, updateLaborFincaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.laboresFincaService.remove(id);
  }
} 