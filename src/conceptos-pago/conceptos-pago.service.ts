import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConceptoPago } from '../entities/concepto-pago.entity';
import { CreateConceptoPagoDto } from './dto/create-concepto-pago.dto';
import { UpdateConceptoPagoDto } from './dto/update-concepto-pago.dto';

@Injectable()
export class ConceptosPagoService {
  constructor(
    @InjectRepository(ConceptoPago)
    private conceptoPagoRepository: Repository<ConceptoPago>,
  ) {}

  async create(createConceptoPagoDto: CreateConceptoPagoDto): Promise<ConceptoPago> {
    const entity = this.conceptoPagoRepository.create(createConceptoPagoDto);
    return this.conceptoPagoRepository.save(entity);
  }

  async findAll(): Promise<ConceptoPago[]> {
    return this.conceptoPagoRepository.find({
      relations: ['unidadMedida', 'finca'],
      where: { activo: true },
    });
  }

  async findOne(id: number): Promise<ConceptoPago> {
    const entity = await this.conceptoPagoRepository.findOne({
      where: { id },
      relations: ['unidadMedida', 'finca'],
    });
    if (!entity) {
      throw new NotFoundException(`Concepto de Pago con ID ${id} no encontrado`);
    }
    return entity;
  }

  async findByUnidadMedida(unidadMedidaId: number): Promise<ConceptoPago[]> {
    return this.conceptoPagoRepository.find({
      where: { 
        unidadMedida: { id: unidadMedidaId },
        activo: true
      },
      relations: ['unidadMedida', 'finca'],
    });
  }

  async findByFinca(fincaId: number): Promise<ConceptoPago[]> {
    return this.conceptoPagoRepository.find({
      where: { 
        fincaId,
        activo: true
      },
      relations: ['unidadMedida', 'finca'],
    });
  }

  async findByUnidadMedidaAndFinca(unidadMedidaId: number, fincaId: number): Promise<ConceptoPago[]> {
    return this.conceptoPagoRepository.find({
      where: { 
        unidadMedida: { id: unidadMedidaId },
        fincaId,
        activo: true
      },
      relations: ['unidadMedida', 'finca'],
    });
  }

  async update(id: number, updateConceptoPagoDto: UpdateConceptoPagoDto): Promise<ConceptoPago> {
    const entity = await this.findOne(id);
    this.conceptoPagoRepository.merge(entity, updateConceptoPagoDto);
    return this.conceptoPagoRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    // Soft delete - actualizar el campo activo a false
    const entity = await this.findOne(id);
    entity.activo = false;
    await this.conceptoPagoRepository.save(entity);
  }
} 