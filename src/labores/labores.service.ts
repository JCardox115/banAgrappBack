import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labor } from '../entities/labor.entity';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';

@Injectable()
export class LaboresService {
  private readonly logger = new Logger(LaboresService.name);

  constructor(
    @InjectRepository(Labor)
    private laboresRepository: Repository<Labor>,
  ) {}

  async findAll(fincaId?: number): Promise<Labor[]> {
    const where: any = { activo: true };
    
    if (fincaId) {
      where.fincaId = fincaId;
    }

    return this.laboresRepository.find({
      where,
      relations: ['lugarEjecucion']
    });
  }

  async findByGrupo(grupoId: number): Promise<Labor[]> {
    return this.laboresRepository.find({
      // where: { grupoLabor: { id: grupoId }, activo: true },
      relations: ['grupoLabor', 'unidadMedida', 'lugarEjecucion']
    });
  }

  async findOne(id: number): Promise<Labor> {
    const labor = await this.laboresRepository.findOneBy({ id });
    
    if (!labor) {
      throw new NotFoundException(`Labor con ID ${id} no encontrada`);
    }
    
    return labor;
  }

  async create(createLaborDto: CreateLaborDto): Promise<Labor> {
    const { 
      lugarEjecucionId, 
      ...laborData 
    } = createLaborDto;
    
    const labor = this.laboresRepository.create({
      ...laborData,
      lugarEjecucion: { id: lugarEjecucionId }
    });
    
    return this.laboresRepository.save(labor);
  }

  async update(id: number, updateLaborDto: UpdateLaborDto): Promise<Labor> {
    const labor = await this.findOne(id);
    
    
    if (updateLaborDto.lugarEjecucionId) {
      labor.lugarEjecucion = { id: updateLaborDto.lugarEjecucionId } as any;
      delete updateLaborDto.lugarEjecucionId;
    }
    
    Object.assign(labor, updateLaborDto);
    
    return this.laboresRepository.save(labor);
  }

  async remove(id: number): Promise<void> {
    const labor = await this.findOne(id);
    labor.activo = false;
    await this.laboresRepository.save(labor);
  }

    // MÉTODOS PARA INFORMES

  // async getRendimientoPorLabor(fincaId: number, empleadoId?: number): Promise<any> {
  //   try {
  //     this.logger.debug(`Generando informe de rendimiento por labor: fincaId=${fincaId}, empleadoId=${empleadoId || 'no definido'}`);
      
  //     // Consulta mejorada con nombres exactos de las tablas en la base de datos
  //     const query = `
  //       WITH labor_rendimiento AS (
  //         SELECT 
  //           l.id AS labor_id,
  //           l.descripcion AS labor_nombre,
  //           l.rendimiento_estandar AS rendimiento_esperado,
  //           CASE 
  //             WHEN COUNT(rl.id) > 0 THEN AVG(rl.cantidad)
  //             ELSE 0
  //           END AS rendimiento_actual
  //         FROM 
  //           labores l
  //         LEFT JOIN grupo_labor gl ON l.id = gl."idLabor"
  //         LEFT JOIN concepto_pago_grupo_labor cpgl ON gl.id = cpgl."grupoLaborId"
  //         LEFT JOIN registros_labor rl ON cpgl.id = rl."conceptoPagoGrupoLaborId"
  //           ${empleadoId ? 'AND rl."empleadoId" = $2' : ''}
  //         WHERE 
  //           l."fincaId" = $1
  //           AND l.activo = TRUE
  //         GROUP BY 
  //           l.id, l.descripcion, l.rendimiento_estandar
  //       )
  //       SELECT 
  //         labor_nombre AS "laborNombre",
  //         rendimiento_esperado AS "rendimientoEsperado",
  //         rendimiento_actual AS "rendimientoActual"
  //       FROM 
  //         labor_rendimiento
  //       ORDER BY 
  //         labor_nombre ASC
  //     `;
      
  //     const params = [fincaId];
  //     if (empleadoId) {
  //       params.push(empleadoId);
  //     }
      
  //     const result = await this.laboresRepository.query(query, params);
      
  //     // Si no hay resultados, devolver datos de ejemplo
  //     if (result.length === 0) {
  //       this.logger.warn(`No se encontraron labores para la finca ${fincaId}`);
  //       return {
  //         labels: ['Sin datos'],
  //         datasets: [
  //           {
  //             label: 'Rendimiento actual',
  //             data: [0],
  //             backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //             borderColor: 'rgb(54, 162, 235)',
  //             pointBackgroundColor: 'rgb(54, 162, 235)',
  //             pointBorderColor: '#fff',
  //             pointHoverBackgroundColor: '#fff',
  //             pointHoverBorderColor: 'rgb(54, 162, 235)'
  //           },
  //           {
  //             label: 'Rendimiento esperado',
  //             data: [100],
  //             backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //             borderColor: 'rgb(255, 99, 132)',
  //             pointBackgroundColor: 'rgb(255, 99, 132)',
  //             pointBorderColor: '#fff',
  //             pointHoverBackgroundColor: '#fff',
  //             pointHoverBorderColor: 'rgb(255, 99, 132)'
  //           }
  //         ]
  //       };
  //     }
      
  //     // Formatear los datos para el gráfico de radar
  //     const labels = result.map(item => item.laborNombre);
      
  //     // Convertir valores a números y normalizar a escala 0-100
  //     const rendimientoActualData = result.map(item => {
  //       const valor = parseFloat(item.rendimientoActual) || 0;
  //       const esperado = parseFloat(item.rendimientoEsperado) || 1;
  //       // Normalizar como porcentaje del esperado, máximo 100
  //       return Math.min(Math.round((valor / esperado) * 100), 100);
  //     });
      
  //     const rendimientoEsperadoData = result.map(() => 100); // Siempre 100% para el esperado
      
  //     return {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Rendimiento actual',
  //           data: rendimientoActualData,
  //           backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //           borderColor: 'rgb(54, 162, 235)',
  //           pointBackgroundColor: 'rgb(54, 162, 235)',
  //           pointBorderColor: '#fff',
  //           pointHoverBackgroundColor: '#fff',
  //           pointHoverBorderColor: 'rgb(54, 162, 235)'
  //         },
  //         {
  //           label: 'Rendimiento esperado',
  //           data: rendimientoEsperadoData,
  //           backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //           borderColor: 'rgb(255, 99, 132)',
  //           pointBackgroundColor: 'rgb(255, 99, 132)',
  //           pointBorderColor: '#fff',
  //           pointHoverBackgroundColor: '#fff',
  //           pointHoverBorderColor: 'rgb(255, 99, 132)'
  //         }
  //       ]
  //     };
  //   } catch (error) {
  //     this.logger.error(`Error al generar informe de rendimiento por labor: ${error.message}`);
  //     this.logger.error(error.stack);
      
  //     // En caso de error, devolver datos de muestra
  //     return {
  //       labels: ['Error al cargar datos'],
  //       datasets: [
  //         {
  //           label: 'Rendimiento actual',
  //           data: [0],
  //           backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //           borderColor: 'rgb(54, 162, 235)',
  //           pointBackgroundColor: 'rgb(54, 162, 235)',
  //           pointBorderColor: '#fff',
  //           pointHoverBackgroundColor: '#fff',
  //           pointHoverBorderColor: 'rgb(54, 162, 235)'
  //         },
  //         {
  //           label: 'Rendimiento esperado',
  //           data: [100],
  //           backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //           borderColor: 'rgb(255, 99, 132)',
  //           pointBackgroundColor: 'rgb(255, 99, 132)',
  //           pointBorderColor: '#fff',
  //           pointHoverBackgroundColor: '#fff',
  //           pointHoverBorderColor: 'rgb(255, 99, 132)'
  //         }
  //       ]
  //     };
  //   }
  // }
} 