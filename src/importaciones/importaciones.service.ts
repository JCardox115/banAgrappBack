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
      'conceptoPago': this.conceptoPagoRepository,
      'conceptoPagoGrupoLabor': this.conceptoPagoGrupoLaborRepository
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

      // Validar y preparar los datos
      for (const item of data) {
        try {
          // Validar campos requeridos
          if (!item.codigo || !item.descripcion) {
            errors.push(`Registro inválido: código y descripción son requeridos`);
            continue;
          }

          // Verificar si ya existe un registro con el mismo código
          const existing = await repository.findOne({ where: { codigo: item.codigo } });
          if (existing) {
            errors.push(`Registro con código ${item.codigo} ya existe`);
            continue;
          }

          validData.push({
            ...item,
            activo: true,
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
} 