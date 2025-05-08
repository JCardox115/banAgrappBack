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
      const errors: string[] = [];
      let validData: any[] = [];

      // Manejo especial para GrupoLabor y ConceptoPagoGrupoLabor
      if (entityName === 'grupoLabor') {
        validData = await this.processGrupoLabor(data, errors);
      } else if (entityName === 'conceptoPagoGrupoLabor') {
        validData = await this.processConceptoPagoGrupoLabor(data, errors);
      } else {
        // Procesamiento normal para otras entidades
        const repository = this.getRepository(entityName);
        
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
      }

      if (validData.length === 0) {
        return {
          success: false,
          message: 'No hay datos válidos para importar',
          errors
        };
      }

      console.log(`Datos válidos para importar (${entityName}):`, validData.length);
      
      // Guardar los datos según la entidad
      if (entityName === 'grupoLabor') {
        await this.grupoLaborRepository.save(validData);
      } else if (entityName === 'conceptoPagoGrupoLabor') {
        await this.conceptoPagoGrupoLaborRepository.save(validData);
      } else {
        const repository = this.getRepository(entityName);
        await repository.save(validData);
      }

      return {
        success: true,
        message: `Se importaron ${validData.length} registros correctamente`,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Error durante la importación:', error);
      return {
        success: false,
        message: 'Error durante la importación',
        errors: [error.message]
      };
    }
  }

  // Método para procesar importación de GrupoLabor
  private async processGrupoLabor(data: any[], errors: string[]): Promise<any[]> {
    const validData: GrupoLabor[] = [];
    const fincasCache = new Map<string, number>();
    const laboresCache = new Map<string, Map<number, number>>();
    const gruposCache = new Map<string, Map<number, number>>();

    // Precargar datos de fincas
    const fincas = await this.fincaRepository.find();
    fincas.forEach(finca => {
      if (finca.descripcion) {
        fincasCache.set(finca.descripcion.toLowerCase(), finca.id);
      }
    });

    // Precargar datos de labores agrupados por finca
    const labores = await this.laborRepository.find();
    labores.forEach(labor => {
      if (labor.descripcion && labor.fincaId) {
        if (!laboresCache.has(labor.descripcion.toLowerCase())) {
          laboresCache.set(labor.descripcion.toLowerCase(), new Map<number, number>());
        }
        laboresCache.get(labor.descripcion.toLowerCase())!.set(labor.fincaId, labor.id);
      }
    });

    // Precargar datos de grupos agrupados por finca
    const grupos = await this.grupoRepository.find();
    grupos.forEach(grupo => {
      if (grupo.descripcion && grupo.fincaId) {
        if (!gruposCache.has(grupo.descripcion.toLowerCase())) {
          gruposCache.set(grupo.descripcion.toLowerCase(), new Map<number, number>());
        }
        gruposCache.get(grupo.descripcion.toLowerCase())!.set(grupo.fincaId, grupo.id);
      }
    });

    // Procesar cada registro
    for (const item of data) {
      try {
        const { labor: laborDesc, grupo: grupoDesc, fincaId: fincaDesc, ...rest } = item;
        
        if (!laborDesc || !grupoDesc || !fincaDesc) {
          errors.push('Faltan campos obligatorios: labor, grupo o fincaId');
          continue;
        }

        // Obtener ID de finca
        const fincaIdLower = fincaDesc.toLowerCase().trim();
        if (!fincasCache.has(fincaIdLower)) {
          errors.push(`No se encontró la finca con descripción: ${fincaDesc}`);
          continue;
        }
        const fincaId = fincasCache.get(fincaIdLower)!;

        // Obtener ID de labor por descripción y fincaId
        const laborLower = laborDesc.toLowerCase().trim();
        if (!laboresCache.has(laborLower) || !laboresCache.get(laborLower)!.has(fincaId)) {
          errors.push(`No se encontró la labor '${laborDesc}' para la finca '${fincaDesc}'`);
          continue;
        }
        const idLabor = laboresCache.get(laborLower)!.get(fincaId)!;

        // Obtener ID de grupo por descripción y fincaId
        const grupoLower = grupoDesc.toLowerCase().trim();
        if (!gruposCache.has(grupoLower) || !gruposCache.get(grupoLower)!.has(fincaId)) {
          errors.push(`No se encontró el grupo '${grupoDesc}' para la finca '${fincaDesc}'`);
          continue;
        }
        const idGrupo = gruposCache.get(grupoLower)!.get(fincaId)!;

        // Verificar si ya existe la relación
        const existingRelation = await this.grupoLaborRepository.findOne({
          where: { idLabor, idGrupo }
        });

        if (existingRelation) {
          errors.push(`Ya existe una relación entre la labor '${laborDesc}' y el grupo '${grupoDesc}' para la finca '${fincaDesc}'`);
          continue;
        }

        // Crear nuevo registro de GrupoLabor
        validData.push({
          idLabor,
          idGrupo,
          activo: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...rest
        });
      } catch (error) {
        errors.push(`Error procesando relación labor-grupo: ${error.message}`);
      }
    }

    return validData;
  }

  // Método para procesar importación de ConceptoPagoGrupoLabor
  private async processConceptoPagoGrupoLabor(data: any[], errors: string[]): Promise<any[]> {
    const validData: ConceptoPagoGrupoLabor[] = [];
    const fincasCache = new Map<string, number>();
    const laboresCache = new Map<string, Map<number, number>>();
    const conceptosCache = new Map<string, Map<number, number>>();
    const grupoLaborCache = new Map<number, Map<number, number>>();

    // Precargar datos de fincas
    const fincas = await this.fincaRepository.find();
    fincas.forEach(finca => {
      if (finca.descripcion) {
        fincasCache.set(finca.descripcion.toLowerCase(), finca.id);
      }
    });

    // Precargar datos de labores agrupados por finca
    const labores = await this.laborRepository.find();
    labores.forEach(labor => {
      if (labor.descripcion && labor.fincaId) {
        if (!laboresCache.has(labor.descripcion.toLowerCase())) {
          laboresCache.set(labor.descripcion.toLowerCase(), new Map<number, number>());
        }
        laboresCache.get(labor.descripcion.toLowerCase())!.set(labor.fincaId, labor.id);
      }
    });

    // Precargar datos de conceptos de pago agrupados por finca
    const conceptos = await this.conceptoPagoRepository.find();
    conceptos.forEach(concepto => {
      if (concepto.descripcion && concepto.fincaId) {
        if (!conceptosCache.has(concepto.descripcion.toLowerCase())) {
          conceptosCache.set(concepto.descripcion.toLowerCase(), new Map<number, number>());
        }
        conceptosCache.get(concepto.descripcion.toLowerCase())!.set(concepto.fincaId, concepto.id);
      }
    });

    // Precargar relaciones GrupoLabor (por idLabor e idGrupo)
    const gruposLabores = await this.grupoLaborRepository.find();
    gruposLabores.forEach(grupoLabor => {
      if (!grupoLaborCache.has(grupoLabor.idLabor)) {
        grupoLaborCache.set(grupoLabor.idLabor, new Map<number, number>());
      }
      grupoLaborCache.get(grupoLabor.idLabor)!.set(grupoLabor.idGrupo, grupoLabor.id);
    });

    // Precargar las relaciones Grupo para cada labor
    const gruposConLabores = await this.grupoLaborRepository.find({
      relations: ['grupo']
    });
    
    // Procesar cada registro
    for (const item of data) {
      try {
        const { conceptoPago: conceptoDesc, labor: laborDesc, fincaId: fincaDesc, ...rest } = item;
        
        if (!conceptoDesc || !laborDesc || !fincaDesc) {
          errors.push('Faltan campos obligatorios: conceptoPago, labor o fincaId');
          continue;
        }

        // Obtener ID de finca
        const fincaIdLower = fincaDesc.toLowerCase().trim();
        if (!fincasCache.has(fincaIdLower)) {
          errors.push(`No se encontró la finca con descripción: ${fincaDesc}`);
          continue;
        }
        const fincaId = fincasCache.get(fincaIdLower)!;

        // Obtener ID de labor por descripción y fincaId
        const laborLower = laborDesc.toLowerCase().trim();
        if (!laboresCache.has(laborLower) || !laboresCache.get(laborLower)!.has(fincaId)) {
          errors.push(`No se encontró la labor '${laborDesc}' para la finca '${fincaDesc}'`);
          continue;
        }
        const idLabor = laboresCache.get(laborLower)!.get(fincaId)!;

        // Obtener todos los grupos asociados a esta labor
        const gruposLaboresParaLabor = gruposConLabores.filter(gl => gl.idLabor === idLabor);
        
        if (gruposLaboresParaLabor.length === 0) {
          errors.push(`La labor '${laborDesc}' no está asociada a ningún grupo en la finca '${fincaDesc}'`);
          continue;
        }

        // Obtener ID de concepto de pago por descripción y fincaId
        const conceptoLower = conceptoDesc.toLowerCase().trim();
        if (!conceptosCache.has(conceptoLower) || !conceptosCache.get(conceptoLower)!.has(fincaId)) {
          errors.push(`No se encontró el concepto de pago '${conceptoDesc}' para la finca '${fincaDesc}'`);
          continue;
        }
        const conceptoPagoId = conceptosCache.get(conceptoLower)!.get(fincaId)!;

        // Procesar cada GrupoLabor asociado a esta labor
        for (const grupoLabor of gruposLaboresParaLabor) {
          const grupoLaborId = grupoLabor.id;
          
          // Verificar si ya existe la relación
          const existingRelation = await this.conceptoPagoGrupoLaborRepository.findOne({
            where: { conceptoPagoId, grupoLaborId }
          });

          if (existingRelation) {
            errors.push(`Ya existe una relación entre el concepto '${conceptoDesc}' y la labor '${laborDesc}' para el grupo '${grupoLabor.grupo?.descripcion || 'Desconocido'}' en la finca '${fincaDesc}'`);
            continue;
          }

          // Crear nuevo registro de ConceptoPagoGrupoLabor
          validData.push({
            conceptoPagoId,
            grupoLaborId,
            activo: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...rest
          });
        }
      } catch (error) {
        errors.push(`Error procesando relación concepto-labor: ${error.message}`);
      }
    }

    return validData;
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