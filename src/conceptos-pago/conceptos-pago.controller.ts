import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConceptosPagoService } from './conceptos-pago.service';
import { CreateConceptoPagoDto } from './dto/create-concepto-pago.dto';
import { UpdateConceptoPagoDto } from './dto/update-concepto-pago.dto';

@Controller('conceptos-pago')
@UseGuards(JwtAuthGuard)
export class ConceptosPagoController {
  constructor(private readonly conceptosPagoService: ConceptosPagoService) {}

  @Post()
  create(@Body() createConceptoPagoDto: CreateConceptoPagoDto) {
    return this.conceptosPagoService.create(createConceptoPagoDto);
  }

  @Get()
  findAll(@Query('unidadMedidaId') unidadMedidaId?: string, @Query('fincaId') fincaId?: string) {
    if (unidadMedidaId && fincaId) {
      return this.conceptosPagoService.findByUnidadMedidaAndFinca(+unidadMedidaId, +fincaId);
    } else if (unidadMedidaId) {
      return this.conceptosPagoService.findByUnidadMedida(+unidadMedidaId);
    } else if (fincaId) {
      return this.conceptosPagoService.findByFinca(+fincaId);
    }
    return this.conceptosPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conceptosPagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConceptoPagoDto: UpdateConceptoPagoDto) {
    return this.conceptosPagoService.update(+id, updateConceptoPagoDto);
  }
  
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateConceptoPagoDto: UpdateConceptoPagoDto) {
    return this.conceptosPagoService.update(+id, updateConceptoPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conceptosPagoService.remove(+id);
  }
} 