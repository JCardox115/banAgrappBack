import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CentrosCostoService } from './centros-costo.service';
import { CentroCosto } from '../entities/centro-costo.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateCentroCostoDto } from './dto/create-centro-costo.dto';
import { UpdateCentroCostoDto } from './dto/update-centro-costo.dto';

@Controller('centros-costo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CentrosCostoController {
  constructor(private readonly centrosCostoService: CentrosCostoService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.USER)
  findAll(): Promise<CentroCosto[]> {
    return this.centrosCostoService.findAll();
  }

  @Get('finca/:fincaId')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.USER)
  findByFinca(@Param('fincaId') fincaId: number): Promise<CentroCosto[]> {
    return this.centrosCostoService.findByFinca(fincaId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.USER)
  findOne(@Param('id') id: number): Promise<CentroCosto> {
    return this.centrosCostoService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCentroCostoDto: CreateCentroCostoDto): Promise<CentroCosto> {
    return this.centrosCostoService.create(createCentroCostoDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: number,
    @Body() updateCentroCostoDto: UpdateCentroCostoDto,
  ): Promise<CentroCosto> {
    return this.centrosCostoService.update(id, updateCentroCostoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.centrosCostoService.remove(id);
  }
} 