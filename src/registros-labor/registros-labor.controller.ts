import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, Logger } from '@nestjs/common';
import { RegistrosLaborService } from './registros-labor.service';
import { CreateRegistroLaborDto } from './dto/create-registro-labor.dto';
import { UpdateRegistroLaborDto } from './dto/update-registro-labor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('registros-labor')
@UseGuards(JwtAuthGuard)
export class RegistrosLaborController {
  private readonly logger = new Logger(RegistrosLaborController.name);

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

  // ENDPOINTS PARA INFORMES

  @Get('horas-por-grupo')
  getHorasPorGrupo(
    @Query('fincaId') fincaId: number,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('empleadoId') empleadoId?: number
  ) {
    const fechaInicioSanitizada = fechaInicio.split('T')[0];
    const fechaFinSanitizada = fechaFin.split('T')[0];
    
    return this.registrosLaborService.getHorasPorGrupo(
      fincaId, 
      fechaInicioSanitizada, 
      fechaFinSanitizada, 
      empleadoId
    );
  }

  @Get('horas-por-semana')
  getHorasPorSemana(
    @Query('fincaId') fincaId: number,
    @Query('anio') anio: number,
    @Query('empleadoId') empleadoId?: number
  ) {
    return this.registrosLaborService.getHorasPorSemana(fincaId, anio, empleadoId);
  }

  @Get('areas-por-lote')
  getAreasPorLote(
    @Query('fincaId') fincaId: number,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('empleadoId') empleadoId?: number
  ) {
    try {
      this.logger.debug(`Recibida solicitud de áreas por lote: fincaId=${fincaId}`);
      
      // Sanitizar fechas
      const fechaInicioSanitizada = fechaInicio ? fechaInicio.split('T')[0] : new Date().toISOString().split('T')[0];
      const fechaFinSanitizada = fechaFin ? fechaFin.split('T')[0] : new Date().toISOString().split('T')[0];
      
      return this.registrosLaborService.getAreasPorLote(
        fincaId, 
        fechaInicioSanitizada, 
        fechaFinSanitizada, 
        empleadoId
      );
    } catch (error) {
      this.logger.error(`Error en getAreasPorLote: ${error.message}`);
      throw error;
    }
  }

  // @Get('costos-por-centro')
  // getCostosPorCentroCosto(
  //   @Query('fincaId') fincaId: number,
  //   @Query('fechaInicio') fechaInicio: string,
  //   @Query('fechaFin') fechaFin: string,
  //   @Query('empleadoId') empleadoId?: number
  // ) {
  //   try {
  //     this.logger.debug(`Recibida solicitud de costos por centro: fincaId=${fincaId}`);
      
  //     // Sanitizar fechas
  //     const fechaInicioSanitizada = fechaInicio ? fechaInicio.split('T')[0] : new Date().toISOString().split('T')[0];
  //     const fechaFinSanitizada = fechaFin ? fechaFin.split('T')[0] : new Date().toISOString().split('T')[0];
      
  //     return this.registrosLaborService.getCostosPorCentroCosto(
  //       fincaId, 
  //       fechaInicioSanitizada, 
  //       fechaFinSanitizada, 
  //       empleadoId
  //     );
  //   } catch (error) {
  //     this.logger.error(`Error en getCostosPorCentroCosto: ${error.message}`);
  //     throw error;
  //   }
  // }

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
    this.logger.debug(`PATCH - Actualizando registro ${id} con detalles`);
    this.logger.debug(`Datos del registro: ${JSON.stringify(updateRegistroLaborDto)}`);
    this.logger.debug(`Detalles recibidos: ${JSON.stringify(detalles)}`);
    
    if (!updateRegistroLaborDto) {
      this.logger.error('Error: No se recibió el objeto registro');
      throw new Error('El objeto registro es requerido');
    }
    
    // Asegurar que el id en el DTO coincida con el id del parámetro
    if (!updateRegistroLaborDto.id) {
      this.logger.debug(`Añadiendo ID ${id} al DTO de actualización`);
      updateRegistroLaborDto.id = +id; // Convertir a número
    } else if (+updateRegistroLaborDto.id !== +id) {
      this.logger.warn(`ID en DTO (${updateRegistroLaborDto.id}) no coincide con ID de parámetro (${id})`);
      updateRegistroLaborDto.id = +id; // Asegurar que coincida con el parámetro
    }
    
    if (!detalles || !Array.isArray(detalles)) {
      this.logger.error('Error: Detalles no es un array válido');
      throw new Error('Los detalles deben ser un array');
    }
    
    return this.registrosLaborService.updateWithDetalles(id, updateRegistroLaborDto, detalles);
  }

  @Put(':id/with-detalles')
  updateWithDetallesPut(
    @Param('id') id: number,
    @Body('registro') updateRegistroLaborDto: UpdateRegistroLaborDto,
    @Body('detalles') detalles: any[]
  ) {
    this.logger.debug(`PUT - Actualizando registro ${id} con detalles`);
    this.logger.debug(`Datos del registro: ${JSON.stringify(updateRegistroLaborDto)}`);
    this.logger.debug(`Detalles recibidos: ${JSON.stringify(detalles)}`);
    
    if (!updateRegistroLaborDto) {
      this.logger.error('Error: No se recibió el objeto registro');
      throw new Error('El objeto registro es requerido');
    }
    
    // Asegurar que el id en el DTO coincida con el id del parámetro
    if (!updateRegistroLaborDto.id) {
      this.logger.debug(`Añadiendo ID ${id} al DTO de actualización`);
      updateRegistroLaborDto.id = +id; // Convertir a número
    } else if (+updateRegistroLaborDto.id !== +id) {
      this.logger.warn(`ID en DTO (${updateRegistroLaborDto.id}) no coincide con ID de parámetro (${id})`);
      updateRegistroLaborDto.id = +id; // Asegurar que coincida con el parámetro
    }
    
    if (!detalles || !Array.isArray(detalles)) {
      this.logger.error('Error: Detalles no es un array válido');
      throw new Error('Los detalles deben ser un array');
    }
    
    return this.registrosLaborService.updateWithDetalles(id, updateRegistroLaborDto, detalles);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.registrosLaborService.remove(id);
  }
}
