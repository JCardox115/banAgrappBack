import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from '../entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) {}

  async findAll(fincaId?: number): Promise<Empleado[]> {
    const query = this.empleadoRepository.createQueryBuilder('empleado');
    query.where('empleado.activo = :activo', { activo: true });
    
    if (fincaId) {
      query.andWhere('empleado.finca = :fincaId', { fincaId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({ where: { id } });
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return empleado;
  }

  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    const { fincaId, ...empleadoData } = createEmpleadoDto;
    
    const empleado = this.empleadoRepository.create({
      ...empleadoData,
      finca: { id: fincaId }
    });
    
    return this.empleadoRepository.save(empleado);
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto): Promise<Empleado> {
    const empleado = await this.findOne(id);
    
    if (updateEmpleadoDto.fincaId) {
      empleado.finca = { id: updateEmpleadoDto.fincaId } as any;
      delete updateEmpleadoDto.fincaId;
    }
    
    Object.assign(empleado, updateEmpleadoDto);
    
    return this.empleadoRepository.save(empleado);
  }

  async remove(id: number): Promise<void> {
    const empleado = await this.findOne(id);
    empleado.activo = false;
    await this.empleadoRepository.save(empleado);
  }
} 