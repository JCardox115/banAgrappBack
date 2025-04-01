import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FincasService } from './fincas.service';
import { CreateFincaDto } from './dto/create-finca.dto';
import { UpdateFincaDto } from './dto/update-finca.dto';

@Controller('fincas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FincasController {
  constructor(private readonly fincasService: FincasService) {}

  @Post()
  @Roles('admin')
  create(@Body() createFincaDto: CreateFincaDto) {
    return this.fincasService.create(createFincaDto);
  }

  @Get()
  findAll() {
    return this.fincasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fincasService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateFincaDto: UpdateFincaDto) {
    return this.fincasService.update(+id, updateFincaDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.fincasService.remove(+id);
  }
} 