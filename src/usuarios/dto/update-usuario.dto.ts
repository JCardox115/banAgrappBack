import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser una dirección de correo válida' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  lastName?: string;

  @IsOptional()
  @IsEnum(['admin', 'manager', 'user'], { message: 'El rol debe ser admin, manager o user' })
  role?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
} 