import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JwtStrategy');
  
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'l3pit0K_127685___5',
    });
    const jwtSecret = configService.get('JWT_SECRET');
    this.logger.log(`JWT Strategy iniciada con secret: ${jwtSecret ? '[SECRET_DESDE_CONFIG]' : 'l3pit0K_127685___5'}`);
  }

  async validate(payload: any) {
    this.logger.debug(`Validando token JWT para usuario: ${payload.email}, ID: ${payload.sub}`);
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role
    };
  }
} 