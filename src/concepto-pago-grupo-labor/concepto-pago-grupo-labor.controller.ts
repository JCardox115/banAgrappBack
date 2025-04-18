import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConceptoPagoGrupoLaborService } from './concepto-pago-grupo-labor.service';
import { CreateConceptoPagoGrupoLaborDto } from './dto/create-concepto-pago-grupo-labor.dto';
import { UpdateConceptoPagoGrupoLaborDto } from './dto/update-concepto-pago-grupo-labor.dto';

@Controller('concepto-pago-grupo-labor')
@UseGuards(JwtAuthGuard)
export class ConceptoPagoGrupoLaborController {
  constructor(private readonly conceptoPagoGrupoLaborService: ConceptoPagoGrupoLaborService) {}

  @Post()
  create(@Body() createConceptoPagoGrupoLaborDto: CreateConceptoPagoGrupoLaborDto) {
    return this.conceptoPagoGrupoLaborService.create(createConceptoPagoGrupoLaborDto);
  }

  @Get()
  findAll() {
    return this.conceptoPagoGrupoLaborService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conceptoPagoGrupoLaborService.findOne(+id);
  }

  @Get('by-labor-grupo/:idGrupoLabor')
  findByLaborGrupo(@Param('idGrupoLabor') idGrupoLabor: string) {
    return this.conceptoPagoGrupoLaborService.findByLaborGrupo(+idGrupoLabor);
  }

  @Get('by-concepto/:idConceptoPago')
  findByConcepto(@Param('idConceptoPago') idConceptoPago: string) {
    return this.conceptoPagoGrupoLaborService.findByConceptoPago(+idConceptoPago);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConceptoPagoGrupoLaborDto: UpdateConceptoPagoGrupoLaborDto) {
    return this.conceptoPagoGrupoLaborService.update(+id, updateConceptoPagoGrupoLaborDto);
  }
  
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateConceptoPagoGrupoLaborDto: UpdateConceptoPagoGrupoLaborDto) {
    return this.conceptoPagoGrupoLaborService.update(+id, updateConceptoPagoGrupoLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conceptoPagoGrupoLaborService.remove(+id);
  }
} 