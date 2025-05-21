/**
 * Configuración de entornos para la aplicación
 * - development: entorno de desarrollo local
 * - uat: entorno de pruebas de aceptación
 * - production: entorno de producción
 */

export interface EnvConfig {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  app: {
    port: number;
    apiPrefix: string;
    corsOrigin: string | string[];
    rateLimit: {
      windowMs: number;
      max: number;
    }
  };
}

export const envConfig: Record<string, EnvConfig> = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '852456',
      database: process.env.DB_DATABASE || 'dev',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'l3pit0K_127685___5',
      expiresIn: process.env.JWT_EXPIRES_IN || '5d',
    },
    app: {
      port: parseInt(process.env.PORT || '3000', 10),
      apiPrefix: process.env.API_PREFIX || 'api',
      corsOrigin: process.env.CORS_ORIGIN || '*',
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 1000, // límite de 1000 solicitudes por ventana
      }
    }
  },
  uat: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'bananera_uat',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'l3pit0K_127685___5',
      expiresIn: process.env.JWT_EXPIRES_IN || '5d',
    },
    app: {
      port: parseInt(process.env.PORT || '3000', 10),
      apiPrefix: process.env.API_PREFIX || 'api',
      corsOrigin: process.env.CORS_ORIGIN || 'https://uat.reporte-labores.com',
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 500, // límite de 500 solicitudes por ventana
      }
    }
  },
  production: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'bananera_prod',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secreto_produccion',
      expiresIn: process.env.JWT_EXPIRES_IN || '6d',
    },
    app: {
      port: parseInt(process.env.PORT || '3000', 10),
      apiPrefix: process.env.API_PREFIX || 'api',
      corsOrigin: process.env.CORS_ORIGIN || 'https://reporte-labores.com',
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 300, // límite de 300 solicitudes por ventana
      }
    }
  }
};

// Obtiene la configuración basada en el entorno actual
export const getConfig = (): EnvConfig => {
  const env = process.env.NODE_ENV || 'development';
  return envConfig[env] || envConfig.development;
}; 