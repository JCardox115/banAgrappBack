import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LaborFinca } from '../entities/labor-finca.entity';
import { CreateLaborFincaDto } from './dto/create-labor-finca.dto';
import { UpdateLaborFincaDto } from './dto/update-labor-finca.dto';

@Injectable()
export class LaboresFincaService {
  constructor(
    @InjectRepository(LaborFinca)
    private laborFincaRepository: Repository<LaborFinca>,
  ) {}

  async findAll(fincaId?: number): Promise<LaborFinca[]> {
    const query = this.laborFincaRepository.createQueryBuilder('laborFinca');
    query.leftJoinAndSelect('laborFinca.labor', 'labor');
    query.leftJoinAndSelect('laborFinca.finca', 'finca');
    query.leftJoinAndSelect('labor.grupoLabor', 'grupoLabor');
    query.where('laborFinca.activo = :activo', { activo: true });
    
    if (fincaId) {
      query.andWhere('laborFinca.finca = :fincaId', { fincaId });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<LaborFinca> {
    const laborFinca = await this.laborFincaRepository.findOne({ 
      where: { id }, 
      relations: ['labor', 'finca', 'labor.grupoLabor'] 
    });
    if (!laborFinca) {
      throw new NotFoundException(`LaborFinca con ID ${id} no encontrada`);
    }
    return laborFinca;
  }

  async create(createLaborFincaDto: CreateLaborFincaDto): Promise<LaborFinca> {
    const { laborId, fincaId, ...laborFincaData } = createLaborFincaDto;
    
    const laborFinca = this.laborFincaRepository.create({
      ...laborFincaData,
      labor: { id: laborId },
      finca: { id: fincaId }
    });
    
    return this.laborFincaRepository.save(laborFinca);
  }

  async update(id: number, updateLaborFincaDto: UpdateLaborFincaDto): Promise<LaborFinca> {
    const laborFinca = await this.findOne(id);
    
    if (updateLaborFincaDto.laborId) {
      laborFinca.labor = { id: updateLaborFincaDto.laborId } as any;
      delete updateLaborFincaDto.laborId;
    }
    
    if (updateLaborFincaDto.fincaId) {
      laborFinca.finca = { id: updateLaborFincaDto.fincaId } as any;
      delete updateLaborFincaDto.fincaId;
    }
    
    Object.assign(laborFinca, updateLaborFincaDto);
    
    return this.laborFincaRepository.save(laborFinca);
  }

  async remove(id: number): Promise<void> {
    const laborFinca = await this.findOne(id);
    laborFinca.activo = false;
    await this.laborFincaRepository.save(laborFinca);
  }
} 