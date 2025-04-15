import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Finca } from '../entities/finca.entity';

@Injectable()
export class UserFincaService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Finca)
    private fincaRepository: Repository<Finca>,
  ) {}

  async getFincasByUserId(userId: number): Promise<Finca[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['fincas'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return user.fincas || [];
  }

  async assignFincasToUser(userId: number, fincaIds: number[]): Promise<Finca[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['fincas'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const fincas = await this.fincaRepository.findByIds(fincaIds);

    // Actualizar las fincas asignadas al usuario
    user.fincas = fincas;
    await this.userRepository.save(user);

    return fincas;
  }

  async getUsersByFincaId(fincaId: number): Promise<User[]> {
    const finca = await this.fincaRepository.findOne({
      where: { id: fincaId },
      relations: ['usuarios'],
    });

    if (!finca) {
      throw new NotFoundException(`Finca con ID ${fincaId} no encontrada`);
    }

    return finca.usuarios || [];
  }
} 