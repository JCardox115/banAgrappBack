import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { RegistrosLaborService } from './registros-labor.service';
import { CreateRegistroLaborDto } from './dto/create-registro-labor.dto';
import { UpdateRegistroLaborDto } from './dto/update-registro-labor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('registros-labor')
@UseGuards(JwtAuthGuard)
export class RegistrosLaborController {
  constructor(private readonly registrosLaborService: RegistrosLaborService) {}

  @Post()
  create(@Body() createRegistroLaborDto: CreateRegistroLaborDto) {
    return this.registrosLaborService.create(createRegistroLaborDto);
  }

  @Post('with-detalles')
  createWithDetalles(
    @Body('registro') createRegistroLaborDto: CreateRegistroLaborDto,
    @Body('detalles') detalles: any[]
  ) {
    return this.registrosLaborService.createWithDetalles(createRegistroLaborDto, detalles);
  }

  @Post('bulk')
  createBulk(@Body('registros') registros: CreateRegistroLaborDto[]) {
    return this.registrosLaborService.createBulk(registros);
  }

  @Get()
  findAll(@Query('fincaId') fincaId?: number) {
    return this.registrosLaborService.findAll(fincaId);
  }

  @Get('by-fecha')
  findByRangoFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('tipoRegistro') tipoRegistro?: string,
    @Query('fincaId') fincaId?: number
  ) {
    // Sanitizar fechas para eliminar cualquier información de zona horaria
    // Asegurarnos que solo llegue la fecha en formato YYYY-MM-DD
    try {
      // Extraer solo la parte de la fecha (YYYY-MM-DD) si es una fecha completa
      const sanitizeFecha = (fecha: string): string => {
        // Si la fecha ya es un formato válido de YYYY-MM-DD, la devolvemos tal cual
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          return fecha;
        }
        
        // Si contiene información de zona horaria u otros componentes, extraer solo YYYY-MM-DD
        try {
          const dateObj = new Date(fecha);
          return dateObj.toISOString().split('T')[0]; // Extraer solo YYYY-MM-DD
        } catch (err) {
          // Si hay error al parsear, devolver la fecha original y dejar que el error ocurra en el servicio
          return fecha;
        }
      };
      
      const fechaInicioSanitizada = sanitizeFecha(fechaInicio);
      const fechaFinSanitizada = sanitizeFecha(fechaFin);
      
      return this.registrosLaborService.findByRangoFechas(fechaInicioSanitizada, fechaFinSanitizada, tipoRegistro, fincaId);
    } catch (error) {
      throw new Error(`Error procesando fechas: ${error.message}`);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.registrosLaborService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRegistroLaborDto: UpdateRegistroLaborDto) {
    return this.registrosLaborService.update(id, updateRegistroLaborDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: number, @Body() updateRegistroLaborDto: UpdateRegistroLaborDto) {
    return this.registrosLaborService.update(id, updateRegistroLaborDto);
  }

  @Patch(':id/with-detalles')
  updateWithDetalles(
    @Param('id') id: number,
    @Body('registro') updateRegistroLaborDto: UpdateRegistroLaborDto,
    @Body('detalles') detalles: any[]
  ) {
    return this.registrosLaborService.updateWithDetalles(id, updateRegistroLaborDto, detalles);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.registrosLaborService.remove(id);
  }
}
