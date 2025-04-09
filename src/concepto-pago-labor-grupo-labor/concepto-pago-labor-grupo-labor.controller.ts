import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConceptoPagoLaborGrupoLaborService } from './concepto-pago-labor-grupo-labor.service';
import { CreateConceptoPagoLaborGrupoLaborDto } from './dto/create-concepto-pago-labor-grupo-labor.dto';
import { UpdateConceptoPagoLaborGrupoLaborDto } from './dto/update-concepto-pago-labor-grupo-labor.dto';

@Controller('concepto-pago-labor-grupo-labor')
@UseGuards(JwtAuthGuard)
export class ConceptoPagoLaborGrupoLaborController {
  constructor(private readonly conceptoPagoLaborGrupoLaborService: ConceptoPagoLaborGrupoLaborService) {}

  @Post()
  create(@Body() createConceptoPagoLaborGrupoLaborDto: CreateConceptoPagoLaborGrupoLaborDto) {
    return this.conceptoPagoLaborGrupoLaborService.create(createConceptoPagoLaborGrupoLaborDto);
  }

  @Get()
  findAll() {
    return this.conceptoPagoLaborGrupoLaborService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conceptoPagoLaborGrupoLaborService.findOne(+id);
  }

  @Get('by-labor-grupo/:idLaborGrupoLabor')
  findByLaborGrupo(@Param('idLaborGrupoLabor') idLaborGrupoLabor: string) {
    return this.conceptoPagoLaborGrupoLaborService.findByLaborGrupo(+idLaborGrupoLabor);
  }

  @Get('by-concepto/:idConceptoPago')
  findByConcepto(@Param('idConceptoPago') idConceptoPago: string) {
    return this.conceptoPagoLaborGrupoLaborService.findByConceptoPago(+idConceptoPago);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConceptoPagoLaborGrupoLaborDto: UpdateConceptoPagoLaborGrupoLaborDto) {
    return this.conceptoPagoLaborGrupoLaborService.update(+id, updateConceptoPagoLaborGrupoLaborDto);
  }
  
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateConceptoPagoLaborGrupoLaborDto: UpdateConceptoPagoLaborGrupoLaborDto) {
    return this.conceptoPagoLaborGrupoLaborService.update(+id, updateConceptoPagoLaborGrupoLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conceptoPagoLaborGrupoLaborService.remove(+id);
  }
} 