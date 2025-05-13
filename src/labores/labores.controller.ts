import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Logger } from '@nestjs/common';
import { LaboresService } from './labores.service';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Labor } from 'src/entities/labor.entity';

@Controller('labores')
@UseGuards(JwtAuthGuard)
export class LaboresController {
  private readonly logger = new Logger(LaboresController.name);

  constructor(private readonly laboresService: LaboresService) {}

  @Post()
  create(@Body() createLaborDto: CreateLaborDto) {
    return this.laboresService.create(createLaborDto);
  }

  @Get()
  findAll(@Query('fincaId') fincaId?: number) {
    return this.laboresService.findAll(fincaId);
  }

  @Get('by-grupo/:grupoId')
  findByGrupo(@Param('grupoId') grupoId: number) {
    return this.laboresService.findByGrupo(grupoId);
  }

    // ENDPOINTS PARA INFORMES

  // @Get('rendimiento')
  // getRendimientoPorLabor(
  //   @Query('fincaId') fincaId: number,
  //   @Query('empleadoId') empleadoId?: number
  // ) {
  //   try {
  //     this.logger.debug(`Recibida solicitud de rendimiento por labor: fincaId=${fincaId}, empleadoId=${empleadoId || 'no definido'}`);
  //     return this.laboresService.getRendimientoPorLabor(fincaId, empleadoId);
  //   } catch (error) {
  //     this.logger.error(`Error en getRendimientoPorLabor: ${error.message}`);
  //     this.logger.error(error.stack);
  //     throw error;
  //   }
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.laboresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLaborDto: UpdateLaborDto) {
    return this.laboresService.update(id, updateLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.laboresService.remove(id);
  }
} 