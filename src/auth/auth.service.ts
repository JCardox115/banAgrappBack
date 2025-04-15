import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Cargar las fincas del usuario
    const userWithFincas = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['fincas']
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        selectedFincaId: user.selectedFincaId,
        fincas: userWithFincas?.fincas || []
      }
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
    try {
      const savedUser = await this.userRepository.save(user);
      // Obtener el usuario guardado (puede ser un array u objeto)
      const userToReturn = Array.isArray(savedUser) ? savedUser[0] : savedUser;
      
      // Crear un nuevo objeto sin incluir la contraseña
      return {
        id: userToReturn.id,
        email: userToReturn.email,
        firstName: userToReturn.firstName,
        lastName: userToReturn.lastName,
        role: userToReturn.role,
      };
    } catch (error) {
      if (error.code === '23505') { // código de error de PostgreSQL para violación de unicidad
        throw new UnauthorizedException('El correo electrónico ya está registrado');
      }
      throw error;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    // Aquí implementaríamos el envío de correo con el token de recuperación
    // Por ahora solo retornamos un mensaje de éxito
    return { message: 'Se ha enviado un correo con las instrucciones para recuperar su contraseña' };
  }
} 