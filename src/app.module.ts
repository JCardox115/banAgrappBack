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
import { LaboresFincaModule } from './labores-finca/labores-finca.module';
import { RegistrosLaborModule } from './registros-labor/registros-labor.module';
import { UnidadMedidaModule } from './unidades-medida/unidad-medida.module';
import { ReportesModule } from './reportes/reportes.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { CorsController } from './controllers/cors.controller';
import { TestController } from './controllers/test.controller';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    LaboresFincaModule,
    RegistrosLaborModule,
    UnidadMedidaModule,
    ReportesModule,
    UsuariosModule
  ],
  controllers: [CorsController, TestController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar el middleware CORS a todas las rutas
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
