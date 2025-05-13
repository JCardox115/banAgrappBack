import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from '../entities/lote.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Injectable()
export class LotesService {
  private readonly logger = new Logger(LotesService.name);

  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  async findAll(fincaId?: number): Promise<Lote[]> {
    const query = this.loteRepository.createQueryBuilder('lote');
    // query.where('lote.activo = :activo', { activo: true });
    
    if (fincaId) {
      query.andWhere('lote.finca = :fincaId', { fincaId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Lote> {
    const lote = await this.loteRepository.findOne({ where: { id } });
    if (!lote) {
      throw new NotFoundException(`Lote con ID ${id} no encontrado`);
    }
    return lote;
  }

  async create(createLoteDto: CreateLoteDto): Promise<Lote> {
    const lote = this.loteRepository.create({
      ...createLoteDto,
      finca: { id: createLoteDto.fincaId }
    });
    return this.loteRepository.save(lote);
  }

  async update(id: number, updateLoteDto: UpdateLoteDto): Promise<Lote> {
    const lote = await this.findOne(id);
    
    if (updateLoteDto.fincaId) {
      lote.finca = { id: updateLoteDto.fincaId } as any;
      delete updateLoteDto.fincaId;
    }
    
    Object.assign(lote, updateLoteDto);
    
    return this.loteRepository.save(lote);
  }

  async remove(id: number): Promise<void> {
    const lote = await this.findOne(id);
    lote.activo = false;
    await this.loteRepository.save(lote);
  }

  findByFinca(fincaId: number) {
    return this.loteRepository.find({
      where: { fincaId },
      relations: ['finca', 'tipoSuelo']
    });
  }

  // MÉTODO PARA INFORME GENERAL
  
  async getHectareasPorTipoSuelo(fincaId: number): Promise<any> {
    try {
      this.logger.debug(`Generando informe de hectáreas por tipo de suelo: fincaId=${fincaId}`);
      
      // Consulta corregida con los nombres correctos de las tablas
      const query = `
        SELECT 
          COALESCE(ts.descripcion, 'Sin clasificar') AS "tipoSueloNombre",
          SUM(l.hectareas_netas) AS "hectareas"
        FROM 
          lotes l
        LEFT JOIN tipos_suelo ts ON l.tipo_suelo_id = ts.id
        WHERE 
          l.finca_id = $1
          AND l.activo = true
        GROUP BY 
          ts.descripcion
        ORDER BY 
          "hectareas" DESC
      `;
      
      // Ejecutar la consulta SQL nativa
      const result = await this.loteRepository.query(query, [fincaId]);
      
      // Generar colores para el gráfico
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC249', '#EA80FC', '#607D8B', '#00BCD4'
      ];
      
      // Si no hay resultados, devolver datos de muestra
      if (result.length === 0) {
        this.logger.warn(`No se encontraron lotes para la finca ${fincaId}`);
        return {
          labels: ['Sin datos'],
          datasets: [{
            data: [1],
            backgroundColor: ['#CCCCCC']
          }]
        };
      }
      
      // Formatear los datos para el gráfico
      const labels = result.map(item => item.tipoSueloNombre);
      const data = result.map(item => parseFloat(item.hectareas));
      const backgroundColor = result.map((_, index) => colors[index % colors.length]);
      
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor
          }
        ]
      };
    } catch (error) {
      this.logger.error(`Error al generar informe de hectáreas por tipo de suelo: ${error.message}`);
      this.logger.error(error.stack);
      
      // En caso de error, devolver datos de muestra
      return {
        labels: ['Error al cargar datos'],
        datasets: [{
          data: [1],
          backgroundColor: ['#CCCCCC']
        }]
      };
    }
  }
} 