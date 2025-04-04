import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'active']
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'active']
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Si se está intentando cambiar el email, verificar que no exista otro usuario con ese email
    if (updateUsuarioDto.email && updateUsuarioDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUsuarioDto.email }
      });
      
      if (existingUser) {
        throw new ConflictException(`Ya existe un usuario con el email ${updateUsuarioDto.email}`);
      }
    }
    
    // Si se proporciona una nueva contraseña, hashearla
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt();
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, salt);
    } else {
      // Si no se proporciona contraseña, no intentar actualizarla
      delete updateUsuarioDto.password;
    }
    
    await this.usersRepository.update(id, updateUsuarioDto);
    
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Verificar que no se esté eliminando al último usuario administrador
    if (user.role === 'admin') {
      const adminCount = await this.usersRepository.count({
        where: { role: 'admin' }
      });
      
      if (adminCount <= 1) {
        throw new BadRequestException('No se puede eliminar el último usuario administrador');
      }
    }
    
    // En lugar de eliminar físicamente, marcar como inactivo
    user.active = false;
    await this.usersRepository.save(user);
    
    return { message: `Usuario con ID ${id} eliminado correctamente` };
  }

  async toggleEstado(id: number, activo: boolean) {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Verificar que no se esté desactivando al último usuario administrador
    if (user.role === 'admin' && !activo) {
      const activeAdminCount = await this.usersRepository.count({
        where: { role: 'admin', active: true }
      });
      
      if (activeAdminCount <= 1) {
        throw new BadRequestException('No se puede desactivar el último usuario administrador activo');
      }
    }
    
    user.active = activo;
    await this.usersRepository.save(user);
    
    return this.findOne(id);
  }

  async cambiarRol(id: number, role: string) {
    // Validar que el rol sea uno de los permitidos
    const rolesPermitidos = ['admin', 'manager', 'user'];
    if (!rolesPermitidos.includes(role)) {
      throw new BadRequestException(`Rol no válido. Debe ser uno de: ${rolesPermitidos.join(', ')}`);
    }
    
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Verificar que no se esté cambiando el rol del último administrador
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await this.usersRepository.count({
        where: { role: 'admin' }
      });
      
      if (adminCount <= 1) {
        throw new BadRequestException('No se puede cambiar el rol del último usuario administrador');
      }
    }
    
    user.role = role;
    await this.usersRepository.save(user);
    
    return this.findOne(id);
  }
} 