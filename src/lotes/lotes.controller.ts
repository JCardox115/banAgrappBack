import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('lotes')
@UseGuards(JwtAuthGuard)
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  findAll(@Query('fincaId') fincaId?: number) {
    return this.lotesService.findAll(fincaId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.lotesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLoteDto: UpdateLoteDto) {
    return this.lotesService.update(id, updateLoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.lotesService.remove(id);
  }
} 