import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConceptoPagoLaborGrupoLabor } from '../entities/concepto-pago-labor-grupo-labor.entity';
import { CreateConceptoPagoLaborGrupoLaborDto } from './dto/create-concepto-pago-labor-grupo-labor.dto';
import { UpdateConceptoPagoLaborGrupoLaborDto } from './dto/update-concepto-pago-labor-grupo-labor.dto';

@Injectable()
export class ConceptoPagoLaborGrupoLaborService {
  constructor(
    @InjectRepository(ConceptoPagoLaborGrupoLabor)
    private conceptoPagoLaborGrupoLaborRepository: Repository<ConceptoPagoLaborGrupoLabor>,
  ) {}

  async create(createConceptoPagoLaborGrupoLaborDto: CreateConceptoPagoLaborGrupoLaborDto): Promise<ConceptoPagoLaborGrupoLabor> {
    const entity = this.conceptoPagoLaborGrupoLaborRepository.create(createConceptoPagoLaborGrupoLaborDto);
    return this.conceptoPagoLaborGrupoLaborRepository.save(entity);
  }

  async findAll(): Promise<ConceptoPagoLaborGrupoLabor[]> {
    return this.conceptoPagoLaborGrupoLaborRepository.find({
      relations: ['conceptoPago', 'laborGrupoLabor']
    });
  }

  async findOne(id: number): Promise<ConceptoPagoLaborGrupoLabor> {
    const entity = await this.conceptoPagoLaborGrupoLaborRepository.findOne({
      where: { id },
      relations: ['conceptoPago', 'laborGrupoLabor']
    });
    if (!entity) {
      throw new NotFoundException(`Concepto Pago Labor Grupo Labor con ID ${id} no encontrado`);
    }
    return entity;
  }

  async findByLaborGrupo(idLaborGrupoLabor: number): Promise<ConceptoPagoLaborGrupoLabor[]> {
    return this.conceptoPagoLaborGrupoLaborRepository.find({
      where: { idLaborGrupoLabor },
      relations: {
        conceptoPago: {
          unidadMedida: true
        },
        laborGrupoLabor: {
          labor: true,
          grupoLabor: true
        }
      }
    });
  }

  async findByConceptoPago(idConceptoPago: number): Promise<ConceptoPagoLaborGrupoLabor[]> {
    return this.conceptoPagoLaborGrupoLaborRepository.find({
      where: { idConceptoPago },
      relations: ['conceptoPago', 'laborGrupoLabor']
    });
  }

  async update(id: number, updateConceptoPagoLaborGrupoLaborDto: UpdateConceptoPagoLaborGrupoLaborDto): Promise<ConceptoPagoLaborGrupoLabor> {
    const entity = await this.findOne(id);
    this.conceptoPagoLaborGrupoLaborRepository.merge(entity, updateConceptoPagoLaborGrupoLaborDto);
    return this.conceptoPagoLaborGrupoLaborRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.conceptoPagoLaborGrupoLaborRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Concepto Pago Labor Grupo Labor con ID ${id} no encontrado`);
    }
  }
} 