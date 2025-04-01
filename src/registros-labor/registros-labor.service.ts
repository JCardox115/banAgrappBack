import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { CreateRegistroLaborDto } from './dto/create-registro-labor.dto';
import { UpdateRegistroLaborDto } from './dto/update-registro-labor.dto';

@Injectable()
export class RegistrosLaborService {
  constructor(
    @InjectRepository(RegistroLabor)
    private registroRepository: Repository<RegistroLabor>,
  ) {}

  async findAll(fincaId?: number): Promise<RegistroLabor[]> {
    const query = this.registroRepository.createQueryBuilder('registro');
    query.leftJoinAndSelect('registro.empleado', 'empleado');
    query.leftJoinAndSelect('registro.laborFinca', 'laborFinca');
    query.leftJoinAndSelect('registro.centroCosto', 'centroCosto');
    query.leftJoinAndSelect('registro.lote', 'lote');
    query.leftJoinAndSelect('laborFinca.labor', 'labor');
    query.leftJoinAndSelect('laborFinca.finca', 'finca');
    query.leftJoinAndSelect('labor.unidadMedida', 'unidadMedida');
    
    if (fincaId) {
      query.andWhere('finca.id = :fincaId', { fincaId });
    }
    
    query.orderBy('registro.fecha', 'DESC');
    
    return query.getMany();
  }

  async findOne(id: number): Promise<RegistroLabor> {
    const registro = await this.registroRepository.findOne({ 
      where: { id },
      relations: [
        'empleado', 
        'laborFinca', 
        'centroCosto', 
        'lote', 
        'laborFinca.labor', 
        'laborFinca.finca',
        'laborFinca.labor.unidadMedida'
      ] 
    });
    
    if (!registro) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
    
    return registro;
  }

  async create(createRegistroLaborDto: CreateRegistroLaborDto): Promise<RegistroLabor> {
    const { 
      empleadoId, 
      laborFincaId, 
      centroCostoId, 
      loteId, 
      ...registroData 
    } = createRegistroLaborDto;
    
    // Calcular el total
    const total = createRegistroLaborDto.cantidad * createRegistroLaborDto.valorUnitario;
    
    const registro = this.registroRepository.create({
      ...registroData,
      total,
      empleado: { id: empleadoId },
      laborFinca: { id: laborFincaId },
      centroCosto: { id: centroCostoId },
      ...(loteId ? { lote: { id: loteId } } : {})
    });
    
    return this.registroRepository.save(registro);
  }

  async createBulk(registrosDto: CreateRegistroLaborDto[]): Promise<RegistroLabor[]> {
    const registrosToSave = registrosDto.map(dto => {
      const { 
        empleadoId, 
        laborFincaId, 
        centroCostoId, 
        loteId, 
        ...registroData 
      } = dto;
      
      // Calcular el total para cada registro
      const total = dto.cantidad * dto.valorUnitario;
      
      return this.registroRepository.create({
        ...registroData,
        total,
        empleado: { id: empleadoId },
        laborFinca: { id: laborFincaId },
        centroCosto: { id: centroCostoId },
        ...(loteId ? { lote: { id: loteId } } : {})
      });
    });
    
    return this.registroRepository.save(registrosToSave);
  }

  async update(id: number, updateRegistroLaborDto: UpdateRegistroLaborDto): Promise<RegistroLabor> {
    const registro = await this.findOne(id);
    
    const { 
      empleadoId, 
      laborFincaId, 
      centroCostoId, 
      loteId, 
      ...registroData 
    } = updateRegistroLaborDto;
    
    if (empleadoId) {
      registro.empleado = { id: empleadoId } as any;
    }
    
    if (laborFincaId) {
      registro.laborFinca = { id: laborFincaId } as any;
    }
    
    if (centroCostoId) {
      registro.centroCosto = { id: centroCostoId } as any;
    }
    
    if (loteId) {
      registro.lote = { id: loteId } as any;
    } else if (loteId === null) {
      registro.lote = null as any;
      registro.cantidadLote = null as any;
    }
    
    Object.assign(registro, registroData);
    
    // Recalcular el total si cambió la cantidad o el valor unitario
    if (updateRegistroLaborDto.cantidad || updateRegistroLaborDto.valorUnitario) {
      const cantidad = updateRegistroLaborDto.cantidad || registro.cantidad;
      const valorUnitario = updateRegistroLaborDto.valorUnitario || registro.valorUnitario;
      registro.total = cantidad * valorUnitario;
    }
    
    return this.registroRepository.save(registro);
  }

  async remove(id: number): Promise<void> {
    const result = await this.registroRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
  }
} 