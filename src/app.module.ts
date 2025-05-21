import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { FincasModule } from './fincas/fincas.module';
import { CentrosCostoModule } from './centros-costo/centros-costo.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { LotesModule } from './lotes/lotes.module';
import { LaboresModule } from './labores/labores.module';
import { LugaresEjecucionModule } from './lugares-ejecucion/lugares-ejecucion.module';
import { RegistrosLaborModule } from './registros-labor/registros-labor.module';
import { UnidadMedidaModule } from './unidades-medida/unidad-medida.module';
import { ReportesModule } from './reportes/reportes.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { CorsController } from './controllers/cors.controller';
import { TestController } from './controllers/test.controller';
import { UsuariosModule } from './usuarios/usuarios.module';
import { GruposModule } from './grupos/grupos.module';
import { TiposSueloModule } from './tipos-suelo/tipos-suelo.module';
import { GrupoLaborModule } from './grupo-labor/grupo-labor.module';
import { ConceptosPagoModule } from './conceptos-pago/conceptos-pago.module';
import { ConceptoPagoGrupoLaborModule } from './concepto-pago-grupo-labor/concepto-pago-grupo-labor.module';
import { UserFincaModule } from './user-finca/user-finca.module';
import { ImportacionesModule } from './importaciones/importaciones.module';
import { RegistrosLaborDetalleModule } from './registros-labor-detalle/registros-labor-detalle.module';
import * as fs from 'fs';
import * as path from 'path';

// Determinar el entorno actual
const nodeEnv = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${nodeEnv}.local`, 
        `.env.${nodeEnv}`, 
        '.env.local', 
        '.env'
      ],
      // Imprimir variables cargadas en consola (solo nombres, no valores por seguridad)
      expandVariables: true, // Permitir expansión de variables
      cache: false, // No cachear en desarrollo
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: +configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || '852456',
        database: configService.get('DB_DATABASE') || 'dev',
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: false, // Deshabilitar SSL explícitamente
        extra: {
          max: 20, // Máximo de conexiones en el pool
          idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar conexiones inactivas
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FincasModule,
    CentrosCostoModule,
    EmpleadosModule,
    LotesModule,
    LaboresModule,
    LugaresEjecucionModule,
    RegistrosLaborModule,
    UnidadMedidaModule,
    ReportesModule,
    UsuariosModule,
    GruposModule,
    TiposSueloModule,
    GrupoLaborModule,
    ConceptosPagoModule,
    ConceptoPagoGrupoLaborModule,
    UserFincaModule,
    ImportacionesModule,
    RegistrosLaborDetalleModule
  ],
  controllers: [CorsController, TestController],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {
    // Imprimir las variables de entorno cargadas (solo el nombre de las que existen)
    console.log('Variables de entorno cargadas:');
    const envVars = ['NODE_ENV', 'JWT_SECRET', 'DB_HOST', 'DB_PORT', 'CORS_ORIGIN'];
    
    envVars.forEach(varName => {
      const value = this.configService.get(varName);
      if (value !== undefined) {
        if (varName === 'JWT_SECRET') {
          console.log(`  - ${varName}: [VALOR_SECRETO_CONFIGURADO]`);
        } else {
          console.log(`  - ${varName}: ${value}`);
        }
      } else {
        console.log(`  - ${varName}: [NO CONFIGURADO]`);
      }
    });

    // Verificar archivos .env encontrados
    const envFilePaths = [
      '.env',
      '.env.local',
      `.env.${nodeEnv}`,
      `.env.${nodeEnv}.local`,
    ].filter(fileName => fs.existsSync(path.join(process.cwd(), fileName)));
    
    console.log('Archivos .env encontrados:', envFilePaths);
  }

  configure(consumer: MiddlewareConsumer) {
    // Aplicar el middleware CORS a todas las rutas
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
