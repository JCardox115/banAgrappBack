import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labor } from '../entities/labor.entity';
import { Empleado } from '../entities/empleado.entity';
import { Lote } from '../entities/lote.entity';
import { CentroCosto } from '../entities/centro-costo.entity';
import { UnidadMedida } from '../entities/unidad-medida.entity';
import { LugarEjecucion } from '../entities/lugar-ejecucion.entity';
import { TipoSuelo } from '../entities/tipo-suelo.entity';
import { GrupoLabor } from '../entities/grupo-labor.entity';
import { ConceptoPago } from '../entities/concepto-pago.entity';
import { ConceptoPagoGrupoLabor } from '../entities/concepto-pago-grupo-labor.entity';
import { Grupo } from 'src/entities/grupo.entity';
import { Finca } from 'src/entities/finca.entity';

@Injectable()
export class ImportacionesService {
  constructor(
    @InjectRepository(Labor)
    private laborRepository: Repository<Labor>,
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @InjectRepository(Lote)
    private loteRepository: Repository<Lote>,
    @InjectRepository(CentroCosto)
    private centroCostoRepository: Repository<CentroCosto>,
    @InjectRepository(UnidadMedida)
    private unidadMedidaRepository: Repository<UnidadMedida>,
    @InjectRepository(LugarEjecucion)
    private lugarEjecucionRepository: Repository<LugarEjecucion>,
    @InjectRepository(TipoSuelo)
    private tipoSueloRepository: Repository<TipoSuelo>,
    @InjectRepository(GrupoLabor)
    private grupoLaborRepository: Repository<GrupoLabor>,
    @InjectRepository(ConceptoPago)
    private conceptoPagoRepository: Repository<ConceptoPago>,
    @InjectRepository(ConceptoPagoGrupoLabor)
    private conceptoPagoGrupoLaborRepository: Repository<ConceptoPagoGrupoLabor>,
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
    @InjectRepository(Finca)
    private fincaRepository: Repository<Finca>,
  ) {}

  private getRepository(entityName: string): Repository<any> {
    const repositories = {
      'labor': this.laborRepository,
      'empleado': this.empleadoRepository,
      'lote': this.loteRepository,
      'centroCosto': this.centroCostoRepository,
      'unidadMedida': this.unidadMedidaRepository,
      'lugarEjecucion': this.lugarEjecucionRepository,
      'tipoSuelo': this.tipoSueloRepository,
      'grupoLabor': this.grupoLaborRepository,
      'conceptosPago': this.conceptoPagoRepository,
      'conceptoPagoGrupoLabor': this.conceptoPagoGrupoLaborRepository,
      'grupo': this.grupoRepository
    };

    const repository = repositories[entityName];
    if (!repository) {
      throw new Error(`Entidad ${entityName} no soportada para importación`);
    }

    return repository;
  }

  async importData(entityName: string, data: any[]): Promise<{ success: boolean; message: string; errors?: string[] }> {
    try {
      const repository = this.getRepository(entityName);
      const errors: string[] = [];
      const validData: any[] = [];

      // Cache para IDs de fincas, lugares de ejecución y unidades de medida
      const fincasCache = new Map<string, number>();
      const lugaresEjecucionCache = new Map<string, number>();
      const unidadesMedidaCache = new Map<string, number>();

      // Cargar datos de fincas, lugares de ejecución y unidades de medida en cache
      await this.precargarCaches(fincasCache, lugaresEjecucionCache, unidadesMedidaCache);

      // Validar y preparar los datos
      for (const item of data) {
        try {
          // Limpiar y convertir valores numéricos
          const cleanedItem = this.cleanNumericValues(item);
          
          // Transformar valores especiales (S/N a booleanos, descripciones a IDs)
          const transformedItem = await this.transformSpecialValues(
            cleanedItem, 
            fincasCache, 
            lugaresEjecucionCache, 
            unidadesMedidaCache,
            errors
          );

          if (!transformedItem) {
            continue; // Saltar este ítem si la transformación falló
          }

          const existing = await repository.findOne({ 
            where: { 
              fincaId: transformedItem.fincaId, 
              codigo: transformedItem.codigo 
            } 
          });
          
          if (existing) {
            errors.push(`Registro con código ${transformedItem.codigo} ya existe para la finca con ID ${transformedItem.fincaId}`);
            continue;
          }

          validData.push({
            ...transformedItem,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } catch (error) {
          errors.push(`Error procesando registro: ${error.message}`);
        }
      }

      if (validData.length === 0) {
        return {
          success: false,
          message: 'No hay datos válidos para importar',
          errors
        };
      }
      console.log(validData);
      // Guardar los datos válidos
      await repository.save(validData);

      return {
        success: true,
        message: `Se importaron ${validData.length} registros correctamente`,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error durante la importación',
        errors: [error.message]
      };
    }
  }

  // Método para precargar los caches de búsqueda
  private async precargarCaches(
    fincasCache: Map<string, number>,
    lugaresEjecucionCache: Map<string, number>,
    unidadesMedidaCache: Map<string, number>
  ): Promise<void> {
    // Cargar todas las fincas
    const fincas = await this.fincaRepository.find();
    fincas.forEach(finca => {
      if (finca.descripcion) {
        fincasCache.set(finca.descripcion.toLowerCase(), finca.id);
      }
    });

    // Cargar todos los lugares de ejecución
    const lugaresEjecucion = await this.lugarEjecucionRepository.find();
    lugaresEjecucion.forEach(lugar => {
      if (lugar.descripcion) {
        lugaresEjecucionCache.set(lugar.descripcion.toLowerCase(), lugar.id);
      }
    });

    // Cargar todas las unidades de medida
    const unidadesMedida = await this.unidadMedidaRepository.find();
    unidadesMedida.forEach(unidad => {
      if (unidad.descripcion) {
        unidadesMedidaCache.set(unidad.descripcion.toLowerCase(), unidad.id);
      }
    });
  }

  // Método para transformar valores especiales (S/N, buscar IDs por descripción)
  private async transformSpecialValues(
    item: any, 
    fincasCache: Map<string, number>,
    lugaresEjecucionCache: Map<string, number>,
    unidadesMedidaCache: Map<string, number>,
    errors: string[]
  ): Promise<any | null> {
    const result = { ...item };
    
    // Transformar campo fincaId (descripción a ID)
    if ('fincaId' in result && typeof result.fincaId === 'string') {
      const fincaDesc = result.fincaId.toLowerCase().trim();
      if (fincasCache.has(fincaDesc)) {
        result.fincaId = fincasCache.get(fincaDesc);
      } else {
        errors.push(`No se encontró la finca con descripción: ${result.fincaId}`);
        return null;
      }
    }
    
    // Transformar campo lugarEjecucionId (Lote, Otros, Canal a ID)
    if ('lugarEjecucionId' in result && typeof result.lugarEjecucionId === 'string') {
      const lugarDesc = result.lugarEjecucionId.toLowerCase().trim();
      if (lugaresEjecucionCache.has(lugarDesc)) {
        result.lugarEjecucionId = lugaresEjecucionCache.get(lugarDesc);
      } else {
        errors.push(`No se encontró el lugar de ejecución con descripción: ${result.lugarEjecucionId}`);
        return null;
      }
    }
    
    // Transformar campo unidadMedidaId (descripción a ID)
    if ('unidadMedidaId' in result && typeof result.unidadMedidaId === 'string') {
      const unidadDesc = result.unidadMedidaId.toLowerCase().trim();
      if (unidadesMedidaCache.has(unidadDesc)) {
        result.unidadMedidaId = unidadesMedidaCache.get(unidadDesc);
      } else {
        errors.push(`No se encontró la unidad de medida con descripción: ${result.unidadMedidaId}`);
        return null;
      }
    }
    
    // Transformar campos booleanos (S/N)
    const booleanFields = ['rendimientoCalculado', 'convertirA20K', 'activo'];
    for (const field of booleanFields) {
      if (field in result && (result[field] === 'S' || result[field] === 'N')) {
        result[field] = result[field] === 'S';
      }
    }
    
    return result;
  }

  // Método para limpiar y convertir valores numéricos
  private cleanNumericValues(item: any): any {
    const cleanedItem: any = {};
    
    for (const key in item) {
      let value = item[key];
      
      // Verificar si es un string que representa un número
      if (typeof value === 'string') {
        // Limpiar espacios en blanco
        const trimmedValue = value.trim();
        
        // Intentar convertir a número si es posible
        if (!isNaN(Number(trimmedValue))) {
          cleanedItem[key] = Number(trimmedValue);
        } else {
          cleanedItem[key] = trimmedValue;
        }
      } else {
        cleanedItem[key] = value;
      }
    }
    
    return cleanedItem;
  }
} 