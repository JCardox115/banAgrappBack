import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Finca } from '../entities/finca.entity';
import { Lote } from '../entities/lote.entity';
import { CentroCosto } from '../entities/centro-costo.entity';
import { Empleado } from '../entities/empleado.entity';
import { Labor } from '../entities/labor.entity';
import { UnidadMedida } from '../entities/unidad-medida.entity';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { LugarEjecucion } from 'src/entities/lugar-ejecucion.entity';
import { TipoSuelo } from 'src/entities/tipo-suelo.entity';
import { GrupoLabor } from 'src/entities/grupo-labor.entity';
import { Grupo } from 'src/entities/grupo.entity';
import { ConceptoPagoGrupoLabor } from 'src/entities/concepto-pago-grupo-labor.entity';
import { ConceptoPago } from 'src/entities/concepto-pago.entity';


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
    Grupo,
    Labor,
    GrupoLabor,
    ConceptoPago,
    ConceptoPagoGrupoLabor,
    UnidadMedida,
    RegistroLabor,
    LugarEjecucion,
    TipoSuelo,
  ],
  migrations: ["src/migrations/*.ts"],
  synchronize: process.env.NODE_ENV !== 'production', // Solo para desarrollo
  logging: process.env.NODE_ENV !== 'production',
  ssl: false, // Deshabilitar SSL explícitamente
  extra: {
    // Configuración adicional para controlar el comportamiento del cliente
    max: 20, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar conexiones inactivas
  },
}; 