import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Finca } from '../entities/finca.entity';
import { Lote } from '../entities/lote.entity';
import { CentroCosto } from '../entities/centro-costo.entity';
import { Empleado } from '../entities/empleado.entity';
import { Labor } from '../entities/labor.entity';
import { LaborFinca } from '../entities/labor-finca.entity';
import { UnidadMedida } from '../entities/unidad-medida.entity';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { LugarEjecucion } from 'src/entities/lugar-ejecucion.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '852456',
  database: process.env.DB_DATABASE || 'dev',
  entities: [
    User,
    Finca,
    Lote,
    CentroCosto,
    Empleado,
    Labor,
    LaborFinca,
    UnidadMedida,
    RegistroLabor,
    LugarEjecucion
  ],
  synchronize: process.env.NODE_ENV !== 'production', // Solo para desarrollo
  logging: process.env.NODE_ENV !== 'production',
  ssl: false, // Deshabilitar SSL explícitamente
  extra: {
    // Configuración adicional para controlar el comportamiento del cliente
    max: 20, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar conexiones inactivas
  },
}; 