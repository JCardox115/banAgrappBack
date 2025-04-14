import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConceptoPagoGrupoLabor } from '../entities/concepto-pago-grupo-labor.entity';
import { CreateConceptoPagoGrupoLaborDto } from './dto/create-concepto-pago-grupo-labor.dto';
import { UpdateConceptoPagoGrupoLaborDto } from './dto/update-concepto-pago-grupo-labor.dto';
@Injectable()
export class ConceptoPagoGrupoLaborService {
  constructor(
    @InjectRepository(ConceptoPagoGrupoLabor)
    private conceptoPagoGrupoLaborRepository: Repository<ConceptoPagoGrupoLabor>,
  ) {}

  async create(createConceptoPagoGrupoLaborDto: CreateConceptoPagoGrupoLaborDto): Promise<ConceptoPagoGrupoLabor> {
    const entity = this.conceptoPagoGrupoLaborRepository.create(createConceptoPagoGrupoLaborDto);
    return this.conceptoPagoGrupoLaborRepository.save(entity);
  }

  async findAll(): Promise<ConceptoPagoGrupoLabor[]> {
    return this.conceptoPagoGrupoLaborRepository.find({
      relations: ['conceptoPago', 'grupoLabor']
    });
  }

  async findOne(id: number): Promise<ConceptoPagoGrupoLabor> {
    const entity = await this.conceptoPagoGrupoLaborRepository.findOne({
      where: { id },
      relations: ['conceptoPago', 'grupoLabor']
    });
    if (!entity) {
      throw new NotFoundException(`Concepto Pago Labor Grupo Labor con ID ${id} no encontrado`);
    }
    return entity;
  }

  async findByLaborGrupo(grupoLaborId: number): Promise<ConceptoPagoGrupoLabor[]> {
    return this.conceptoPagoGrupoLaborRepository.find({
      where: { grupoLaborId },
      relations: {
        conceptoPago: {
          unidadMedida: true
        },
        grupoLabor: {
          labor: true,
          grupo: true
        }
      }
    });
  }

  async findByConceptoPago(conceptoPagoId: number): Promise<ConceptoPagoGrupoLabor[]> {
    return this.conceptoPagoGrupoLaborRepository.find({
      where: { conceptoPagoId },
      relations: ['conceptoPago', 'grupoLabor']
    });
  }

  async update(id: number, updateConceptoPagoGrupoLaborDto: UpdateConceptoPagoGrupoLaborDto): Promise<ConceptoPagoGrupoLabor> {
    const entity = await this.findOne(id);
    this.conceptoPagoGrupoLaborRepository.merge(entity, updateConceptoPagoGrupoLaborDto);
    return this.conceptoPagoGrupoLaborRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.conceptoPagoGrupoLaborRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Concepto Pago Labor Grupo Labor con ID ${id} no encontrado`);
    }
  }
} 